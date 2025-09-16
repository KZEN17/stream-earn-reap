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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      campaign_requirements: {
        Row: {
          campaign_id: string
          created_at: string | null
          id: string
          platform: string
          required: boolean | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          id?: string
          platform: string
          required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          id?: string
          platform?: string
          required?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_requirements_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          admin_notes: string | null
          anomaly_detected: boolean | null
          approval_status: string | null
          asset_requirements: Json | null
          auto_approve: boolean | null
          campaign_image_url: string | null
          campaign_rules: string | null
          category: string | null
          created_at: string
          creator_id: string
          description: string | null
          end_date: string | null
          escrow_cap_usdc: number | null
          escrow_usdc: number | null
          id: string
          manual_approval_required: boolean | null
          max_payout_per_clip: number | null
          min_views_required: number | null
          participants_count: number | null
          payout_paused: boolean | null
          payout_per_1000_views: number | null
          prize_pool: number | null
          rate_usd_per_k: number | null
          requirements: Json | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          target_countries: string[] | null
          title: string
          total_submissions: number | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          anomaly_detected?: boolean | null
          approval_status?: string | null
          asset_requirements?: Json | null
          auto_approve?: boolean | null
          campaign_image_url?: string | null
          campaign_rules?: string | null
          category?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          end_date?: string | null
          escrow_cap_usdc?: number | null
          escrow_usdc?: number | null
          id?: string
          manual_approval_required?: boolean | null
          max_payout_per_clip?: number | null
          min_views_required?: number | null
          participants_count?: number | null
          payout_paused?: boolean | null
          payout_per_1000_views?: number | null
          prize_pool?: number | null
          rate_usd_per_k?: number | null
          requirements?: Json | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          target_countries?: string[] | null
          title: string
          total_submissions?: number | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          anomaly_detected?: boolean | null
          approval_status?: string | null
          asset_requirements?: Json | null
          auto_approve?: boolean | null
          campaign_image_url?: string | null
          campaign_rules?: string | null
          category?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string | null
          escrow_cap_usdc?: number | null
          escrow_usdc?: number | null
          id?: string
          manual_approval_required?: boolean | null
          max_payout_per_clip?: number | null
          min_views_required?: number | null
          participants_count?: number | null
          payout_paused?: boolean | null
          payout_per_1000_views?: number | null
          prize_pool?: number | null
          rate_usd_per_k?: number | null
          requirements?: Json | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          target_countries?: string[] | null
          title?: string
          total_submissions?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      clips: {
        Row: {
          admin_notes: string | null
          anomaly_flagged: boolean | null
          approval_date: string | null
          approved_at: string | null
          campaign_id: string
          created_at: string
          creator_wallet: string | null
          description: string | null
          earned_amount: number | null
          id: string
          instagram_url: string | null
          instagram_views: number | null
          last_view_update: string | null
          milestones_paid: number | null
          payout_status: string | null
          rejected_at: string | null
          rejection_reason: string | null
          status: string | null
          submission_date: string | null
          thumbnail_url: string | null
          tiktok_url: string | null
          tiktok_views: number | null
          title: string
          total_views: number | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          verified_views: number | null
          video_url: string | null
          youtube_url: string | null
          youtube_views: number | null
        }
        Insert: {
          admin_notes?: string | null
          anomaly_flagged?: boolean | null
          approval_date?: string | null
          approved_at?: string | null
          campaign_id: string
          created_at?: string
          creator_wallet?: string | null
          description?: string | null
          earned_amount?: number | null
          id?: string
          instagram_url?: string | null
          instagram_views?: number | null
          last_view_update?: string | null
          milestones_paid?: number | null
          payout_status?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          submission_date?: string | null
          thumbnail_url?: string | null
          tiktok_url?: string | null
          tiktok_views?: number | null
          title: string
          total_views?: number | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verified_views?: number | null
          video_url?: string | null
          youtube_url?: string | null
          youtube_views?: number | null
        }
        Update: {
          admin_notes?: string | null
          anomaly_flagged?: boolean | null
          approval_date?: string | null
          approved_at?: string | null
          campaign_id?: string
          created_at?: string
          creator_wallet?: string | null
          description?: string | null
          earned_amount?: number | null
          id?: string
          instagram_url?: string | null
          instagram_views?: number | null
          last_view_update?: string | null
          milestones_paid?: number | null
          payout_status?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          submission_date?: string | null
          thumbnail_url?: string | null
          tiktok_url?: string | null
          tiktok_views?: number | null
          title?: string
          total_views?: number | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verified_views?: number | null
          video_url?: string | null
          youtube_url?: string | null
          youtube_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clips_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      launch_events: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          game: string | null
          id: string
          max_participants: number | null
          platform: string | null
          scheduled_date: string
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          game?: string | null
          id?: string
          max_participants?: number | null
          platform?: string | null
          scheduled_date: string
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          game?: string | null
          id?: string
          max_participants?: number | null
          platform?: string | null
          scheduled_date?: string
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          campaign_updates: boolean | null
          created_at: string
          email_notifications: boolean | null
          id: string
          payout_notifications: boolean | null
          push_notifications: boolean | null
          raid_alerts: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_updates?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          payout_notifications?: boolean | null
          push_notifications?: boolean | null
          raid_alerts?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_updates?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          payout_notifications?: boolean | null
          push_notifications?: boolean | null
          raid_alerts?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payout_tasks: {
        Row: {
          amount_usdc: number
          campaign_id: string
          clip_id: string
          created_at: string
          creator_wallet: string
          error_message: string | null
          id: string
          idempotency_key: string
          milestone_number: number
          processed_at: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount_usdc: number
          campaign_id: string
          clip_id: string
          created_at?: string
          creator_wallet: string
          error_message?: string | null
          id?: string
          idempotency_key: string
          milestone_number: number
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount_usdc?: number
          campaign_id?: string
          clip_id?: string
          created_at?: string
          creator_wallet?: string
          error_message?: string | null
          id?: string
          idempotency_key?: string
          milestone_number?: number
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_tasks_clip_id_fkey"
            columns: ["clip_id"]
            isOneToOne: false
            referencedRelation: "clips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_tasks_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payout_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_transactions: {
        Row: {
          batch_period: string
          confirmed_at: string | null
          created_at: string
          error_message: string | null
          gas_fee_usdc: number | null
          id: string
          status: string | null
          task_count: number
          total_amount_usdc: number
          tx_hash: string | null
          wallet_address: string
        }
        Insert: {
          batch_period?: string
          confirmed_at?: string | null
          created_at?: string
          error_message?: string | null
          gas_fee_usdc?: number | null
          id?: string
          status?: string | null
          task_count: number
          total_amount_usdc: number
          tx_hash?: string | null
          wallet_address: string
        }
        Update: {
          batch_period?: string
          confirmed_at?: string | null
          created_at?: string
          error_message?: string | null
          gas_fee_usdc?: number | null
          id?: string
          status?: string | null
          task_count?: number
          total_amount_usdc?: number
          tx_hash?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          campaign_id: string | null
          clip_id: string | null
          created_at: string
          id: string
          payment_method: string | null
          payout_rate: number
          status: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string
          views_count: number
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          clip_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          payout_rate: number
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
          views_count: number
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          clip_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          payout_rate?: number
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "payouts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_clip_id_fkey"
            columns: ["clip_id"]
            isOneToOne: false
            referencedRelation: "clips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agency_name: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          instagram_access_token: string | null
          instagram_connected: boolean | null
          instagram_user_id: string | null
          instagram_username: string | null
          instagram_verified: boolean | null
          is_admin: boolean | null
          managed_streamers: string[] | null
          onboarding_completed: boolean | null
          profile_visibility: string | null
          streaming_platform: string | null
          team_contact_info: Json | null
          tiktok_access_token: string | null
          tiktok_connected: boolean | null
          tiktok_user_id: string | null
          tiktok_username: string | null
          tiktok_verified: boolean | null
          twitch_username: string | null
          twitter_access_token: string | null
          twitter_user_id: string | null
          twitter_username: string | null
          twitter_verified: boolean | null
          updated_at: string
          user_id: string
          user_type: string | null
          username: string | null
          wallet_address: string | null
          youtube_access_token: string | null
          youtube_channel_id: string | null
          youtube_connected: boolean | null
          youtube_refresh_token: string | null
          youtube_verified: boolean | null
        }
        Insert: {
          agency_name?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instagram_access_token?: string | null
          instagram_connected?: boolean | null
          instagram_user_id?: string | null
          instagram_username?: string | null
          instagram_verified?: boolean | null
          is_admin?: boolean | null
          managed_streamers?: string[] | null
          onboarding_completed?: boolean | null
          profile_visibility?: string | null
          streaming_platform?: string | null
          team_contact_info?: Json | null
          tiktok_access_token?: string | null
          tiktok_connected?: boolean | null
          tiktok_user_id?: string | null
          tiktok_username?: string | null
          tiktok_verified?: boolean | null
          twitch_username?: string | null
          twitter_access_token?: string | null
          twitter_user_id?: string | null
          twitter_username?: string | null
          twitter_verified?: boolean | null
          updated_at?: string
          user_id: string
          user_type?: string | null
          username?: string | null
          wallet_address?: string | null
          youtube_access_token?: string | null
          youtube_channel_id?: string | null
          youtube_connected?: boolean | null
          youtube_refresh_token?: string | null
          youtube_verified?: boolean | null
        }
        Update: {
          agency_name?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instagram_access_token?: string | null
          instagram_connected?: boolean | null
          instagram_user_id?: string | null
          instagram_username?: string | null
          instagram_verified?: boolean | null
          is_admin?: boolean | null
          managed_streamers?: string[] | null
          onboarding_completed?: boolean | null
          profile_visibility?: string | null
          streaming_platform?: string | null
          team_contact_info?: Json | null
          tiktok_access_token?: string | null
          tiktok_connected?: boolean | null
          tiktok_user_id?: string | null
          tiktok_username?: string | null
          tiktok_verified?: boolean | null
          twitch_username?: string | null
          twitter_access_token?: string | null
          twitter_user_id?: string | null
          twitter_username?: string | null
          twitter_verified?: boolean | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
          username?: string | null
          wallet_address?: string | null
          youtube_access_token?: string | null
          youtube_channel_id?: string | null
          youtube_connected?: boolean | null
          youtube_refresh_token?: string | null
          youtube_verified?: boolean | null
        }
        Relationships: []
      }
      raid_events: {
        Row: {
          created_at: string
          created_by: string | null
          current_participants: number | null
          description: string | null
          goal_amount: number | null
          goal_description: string | null
          id: string
          leader_id: string | null
          max_participants: number | null
          mission_type: string | null
          scheduled_time: string | null
          status: string | null
          target_url: string | null
          title: string
          total_raised: number | null
          twitch_stream_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          goal_amount?: number | null
          goal_description?: string | null
          id?: string
          leader_id?: string | null
          max_participants?: number | null
          mission_type?: string | null
          scheduled_time?: string | null
          status?: string | null
          target_url?: string | null
          title: string
          total_raised?: number | null
          twitch_stream_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          goal_amount?: number | null
          goal_description?: string | null
          id?: string
          leader_id?: string | null
          max_participants?: number | null
          mission_type?: string | null
          scheduled_time?: string | null
          status?: string | null
          target_url?: string | null
          title?: string
          total_raised?: number | null
          twitch_stream_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      streamer_applications: {
        Row: {
          admin_notes: string | null
          application_status: string | null
          created_at: string
          discord_server: string | null
          id: string
          launch_description: string | null
          launch_game: string | null
          launch_thumbnail_url: string | null
          launch_title: string | null
          scheduled_launch_date: string | null
          twitch_username: string | null
          updated_at: string
          user_id: string
          youtube_channel: string | null
        }
        Insert: {
          admin_notes?: string | null
          application_status?: string | null
          created_at?: string
          discord_server?: string | null
          id?: string
          launch_description?: string | null
          launch_game?: string | null
          launch_thumbnail_url?: string | null
          launch_title?: string | null
          scheduled_launch_date?: string | null
          twitch_username?: string | null
          updated_at?: string
          user_id: string
          youtube_channel?: string | null
        }
        Update: {
          admin_notes?: string | null
          application_status?: string | null
          created_at?: string
          discord_server?: string | null
          id?: string
          launch_description?: string | null
          launch_game?: string | null
          launch_thumbnail_url?: string | null
          launch_title?: string | null
          scheduled_launch_date?: string | null
          twitch_username?: string | null
          updated_at?: string
          user_id?: string
          youtube_channel?: string | null
        }
        Relationships: []
      }
      streamers: {
        Row: {
          auto_approved: boolean | null
          created_at: string
          discord_server: string | null
          id: string
          launch_description: string | null
          launch_game: string | null
          launch_thumbnail_url: string | null
          launch_title: string | null
          scheduled_launch_date: string | null
          status: string | null
          twitch_username: string | null
          updated_at: string
          user_id: string
          youtube_channel: string | null
        }
        Insert: {
          auto_approved?: boolean | null
          created_at?: string
          discord_server?: string | null
          id?: string
          launch_description?: string | null
          launch_game?: string | null
          launch_thumbnail_url?: string | null
          launch_title?: string | null
          scheduled_launch_date?: string | null
          status?: string | null
          twitch_username?: string | null
          updated_at?: string
          user_id: string
          youtube_channel?: string | null
        }
        Update: {
          auto_approved?: boolean | null
          created_at?: string
          discord_server?: string | null
          id?: string
          launch_description?: string | null
          launch_game?: string | null
          launch_thumbnail_url?: string | null
          launch_title?: string | null
          scheduled_launch_date?: string | null
          status?: string | null
          twitch_username?: string | null
          updated_at?: string
          user_id?: string
          youtube_channel?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          clips_this_week: number | null
          created_at: string
          earnings_this_week: number | null
          id: string
          rank_position: number | null
          total_clips: number | null
          total_earnings: number | null
          total_views: number | null
          updated_at: string
          user_id: string
          views_this_week: number | null
        }
        Insert: {
          clips_this_week?: number | null
          created_at?: string
          earnings_this_week?: number | null
          id?: string
          rank_position?: number | null
          total_clips?: number | null
          total_earnings?: number | null
          total_views?: number | null
          updated_at?: string
          user_id: string
          views_this_week?: number | null
        }
        Update: {
          clips_this_week?: number | null
          created_at?: string
          earnings_this_week?: number | null
          id?: string
          rank_position?: number | null
          total_clips?: number | null
          total_earnings?: number | null
          total_views?: number | null
          updated_at?: string
          user_id?: string
          views_this_week?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_profile_data: {
        Args: { profile_user_id: string }
        Returns: {
          avatar_url: string
          display_name: string
          user_id: string
          user_type: string
          username: string
        }[]
      }
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
