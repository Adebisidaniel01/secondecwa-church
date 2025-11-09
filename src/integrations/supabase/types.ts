export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          session_expires_at: string | null
          session_token: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          session_expires_at?: string | null
          session_token?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          session_expires_at?: string | null
          session_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          category: string | null
          content: string
          created_at: string
          expiry_date: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          priority: number | null
          publish_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          priority?: number | null
          publish_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          priority?: number | null
          publish_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          phone: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          phone?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          phone?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          dedication: string | null
          donation_type: string | null
          donor_email: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean | null
          is_recurring: boolean | null
          payment_method: string | null
          recurring_frequency: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          dedication?: string | null
          donation_type?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_recurring?: boolean | null
          payment_method?: string | null
          recurring_frequency?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          dedication?: string | null
          donation_type?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_recurring?: boolean | null
          payment_method?: string | null
          recurring_frequency?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attendance_status: string | null
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          event_id: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          registration_date: string
          special_needs: string | null
        }
        Insert: {
          attendance_status?: string | null
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          event_id: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          registration_date?: string
          special_needs?: string | null
        }
        Update: {
          attendance_status?: string | null
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          event_id?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          registration_date?: string
          special_needs?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          category: string
          contact_email: string | null
          contact_phone: string | null
          cost: number | null
          created_at: string
          date: string
          description: string
          end_time: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string
          registration_deadline: string | null
          registration_required: boolean | null
          start_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          cost?: number | null
          created_at?: string
          date: string
          description: string
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location: string
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          cost?: number | null
          created_at?: string
          date?: string
          description?: string
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          address: string | null
          baptism_date: string | null
          confirmation_date: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          family_id: string | null
          first_name: string
          id: string
          last_name: string
          membership_date: string | null
          membership_status: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          baptism_date?: string | null
          confirmation_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          family_id?: string | null
          first_name: string
          id?: string
          last_name: string
          membership_date?: string | null
          membership_status?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          baptism_date?: string | null
          confirmation_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          family_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          membership_date?: string | null
          membership_status?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ministries: {
        Row: {
          age_group: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          leader_email: string | null
          leader_name: string | null
          leader_phone: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
          updated_at: string
          volunteer_positions_available: number | null
        }
        Insert: {
          age_group?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          leader_email?: string | null
          leader_name?: string | null
          leader_phone?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
          updated_at?: string
          volunteer_positions_available?: number | null
        }
        Update: {
          age_group?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          leader_email?: string | null
          leader_name?: string | null
          leader_phone?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
          updated_at?: string
          volunteer_positions_available?: number | null
        }
        Relationships: []
      }
      ministry_activities: {
        Row: {
          activity_name: string
          created_at: string
          id: string
          ministry_id: string
        }
        Insert: {
          activity_name: string
          created_at?: string
          id?: string
          ministry_id: string
        }
        Update: {
          activity_name?: string
          created_at?: string
          id?: string
          ministry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_activities_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_volunteers: {
        Row: {
          created_at: string
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          ministry_id: string
          phone: string | null
          position: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          ministry_id: string
          phone?: string | null
          position?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          ministry_id?: string
          phone?: string | null
          position?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_volunteers_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          subscription_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_url: string
          id: string
          is_featured: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          upload_date?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_confidential: boolean | null
          is_urgent: boolean | null
          name: string
          phone: string | null
          request: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_confidential?: boolean | null
          is_urgent?: boolean | null
          name: string
          phone?: string | null
          request: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_confidential?: boolean | null
          is_urgent?: boolean | null
          name?: string
          phone?: string | null
          request?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string
          date: string
          description: string | null
          download_count: number | null
          duration: number | null
          id: string
          is_featured: boolean | null
          notes: string | null
          scripture: string | null
          series: string | null
          speaker: string
          title: string
          transcript: string | null
          updated_at: string
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          date: string
          description?: string | null
          download_count?: number | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          notes?: string | null
          scripture?: string | null
          series?: string | null
          speaker: string
          title: string
          transcript?: string | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          date?: string
          description?: string | null
          download_count?: number | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          notes?: string | null
          scripture?: string | null
          series?: string | null
          speaker?: string
          title?: string
          transcript?: string | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          file_size: number | null
          file_url: string
          id: string
          is_featured: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          upload_date?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: []
      }
      youtube_settings: {
        Row: {
          api_key: string | null
          channel_id: string | null
          channel_name: string | null
          channel_url: string | null
          created_at: string
          id: string
          is_live: boolean | null
          live_stream_key: string | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          channel_id?: string | null
          channel_name?: string | null
          channel_url?: string | null
          created_at?: string
          id?: string
          is_live?: boolean | null
          live_stream_key?: string | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          channel_id?: string | null
          channel_name?: string | null
          channel_url?: string | null
          created_at?: string
          id?: string
          is_live?: boolean | null
          live_stream_key?: string | null
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
