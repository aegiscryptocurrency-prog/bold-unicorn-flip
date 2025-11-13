// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4';
// @ts-ignore
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

console.log('Hello from Functions!');

serve(async (req) => {
  try {
    const { record } = await req.json(); // The new row inserted into appraisal_requests

    if (!record) {
      return new Response(JSON.stringify({ error: 'No record found in request body.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseClient = createClient(
      // @ts-ignore
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key for backend operations
      {
        auth: {
          persistSession: false,
        },
      },
    );

    // Simulate appraisal logic (replace with actual API calls and ML models later)
    const appraisedValue = Math.floor(Math.random() * (50000 - 500 + 1)) + 500;
    const qualityAssessment = record.item_condition === "Excellent" ? "Excellent Condition" : record.item_condition === "Good" ? "Good Condition" : "Fair Condition";
    const qualityExplanation = `Based on the provided condition: ${record.item_condition}. Further detailed assessment would require physical inspection.`;
    const appraisalMethodology = "Simulated Comparative Market Analysis (CMA) and Expert Opinion";
    const dataSources = [
      "Simulated Auction Results",
      "Simulated Private Sales Data",
      "General Market Trends",
    ];
    const expertInsights = `A simulated expert specializing in ${record.item_category} provided insights based on general market knowledge.`;
    const sellBuyOptions = [
      "Simulated Online marketplaces",
      "Simulated Local antique shops",
      "Simulated Specialized auction houses",
    ];

    // Insert the appraisal result into the appraisal_results table
    const { data: resultData, error: insertError } = await supabaseClient
      .from('appraisal_results')
      .insert([
        {
          request_id: record.id,
          appraised_value: appraisedValue,
          currency: 'USD',
          quality_assessment: qualityAssessment,
          quality_explanation: qualityExplanation,
          appraisal_methodology: appraisalMethodology,
          data_sources: dataSources,
          expert_insights: expertInsights,
          sell_buy_options: sellBuyOptions,
        },
      ]);

    if (insertError) {
      console.error('Error inserting appraisal result:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Appraisal result inserted:', resultData);

    return new Response(JSON.stringify({ message: 'Appraisal processed successfully', result: resultData }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Function execution error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});