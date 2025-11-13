export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appraisal_requests: {
        Row: {
          agreed_terms: boolean
          created_at: string
          id: string
          image_url: string | null
          item_category: string
          item_condition: string
          item_description: string
          item_history: string | null
          item_name: string
          user_id: string | null
        }
        Insert: {
          agreed_terms: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          item_category: string
          item_condition: string
          item_description: string
          item_history?: string | null
          item_name: string
          user_id?: string | null
        }
        Update: {
          agreed_terms?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          item_category?: string
          item_condition?: string
          item_description?: string
          item_history?: string | null
          item_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appraisal_results: {
        Row: {
          appraisal_methodology: string
          appraised_value: number
          created_at: string
          currency: string
          data_sources: string[]
          expert_insights: string
          id: string
          quality_assessment: string
          quality_explanation: string
          request_id: string
          sell_buy_options: string[]
        }
        Insert: {
          appraisal_methodology: string
          appraised_value: number
          created_at?: string
          currency?: string
          data_sources: string[]
          expert_insights: string
          id?: string
          quality_assessment: string
          quality_explanation: string
          request_id: string
          sell_buy_options: string[]
        }
        Update: {
          appraisal_methodology?: string
          appraised_value?: number
          created_at?: string
          currency?: string
          data_sources?: string[]
          expert_insights?: string
          id?: string
          quality_assessment?: string
          quality_explanation?: string
          request_id?: string
          sell_buy_options?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "appraisal_results_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "appraisal_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never