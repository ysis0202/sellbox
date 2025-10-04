// Supabase 데이터베이스 타입 정의

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          handle: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          handle: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          handle?: string
          created_at?: string
        }
      }
      live_sessions: {
        Row: {
          id: string
          store_id: string
          name: string
          description: string | null
          session_code: string
          status: 'active' | 'closed'
          bank_name: string | null
          bank_account: string | null
          bank_holder: string | null
          view_count: number
          order_count: number
          created_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          description?: string | null
          session_code?: string
          status?: 'active' | 'closed'
          bank_name?: string | null
          bank_account?: string | null
          bank_holder?: string | null
          view_count?: number
          order_count?: number
          created_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          description?: string | null
          session_code?: string
          status?: 'active' | 'closed'
          bank_name?: string | null
          bank_account?: string | null
          bank_holder?: string | null
          view_count?: number
          order_count?: number
          created_at?: string
          closed_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          order_no: string
          session_id: string
          store_id: string
          buyer_name: string
          buyer_nickname: string
          buyer_phone: string
          buyer_contact: string | null
          product_image_url: string
          product_note: string | null
          buyer_price_info: string | null
          amount: number | null
          payment_method: string
          payment_proof_url: string | null
          zipcode: string | null
          address1: string | null
          address2: string | null
          delivery_note: string | null
          ship_courier: string | null
          ship_tracking_no: string | null
          ship_photo_url: string | null
          status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'completed' | 'cancelled'
          seller_note: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          paid_at: string | null
          shipped_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          order_no?: string
          session_id: string
          store_id: string
          buyer_name: string
          buyer_nickname: string
          buyer_phone: string
          buyer_contact?: string | null
          product_image_url: string
          product_note?: string | null
          buyer_price_info?: string | null
          amount?: number | null
          payment_method?: string
          payment_proof_url?: string | null
          zipcode?: string | null
          address1?: string | null
          address2?: string | null
          delivery_note?: string | null
          ship_courier?: string | null
          ship_tracking_no?: string | null
          ship_photo_url?: string | null
          status?: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'completed' | 'cancelled'
          seller_note?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          paid_at?: string | null
          shipped_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          order_no?: string
          session_id?: string
          store_id?: string
          buyer_name?: string
          buyer_nickname?: string
          buyer_phone?: string
          buyer_contact?: string | null
          product_image_url?: string
          product_note?: string | null
          buyer_price_info?: string | null
          amount?: number | null
          payment_method?: string
          payment_proof_url?: string | null
          zipcode?: string | null
          address1?: string | null
          address2?: string | null
          delivery_note?: string | null
          ship_courier?: string | null
          ship_tracking_no?: string | null
          ship_photo_url?: string | null
          status?: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'completed' | 'cancelled'
          seller_note?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          paid_at?: string | null
          shipped_at?: string | null
          completed_at?: string | null
        }
      }
    }
  }
}

// 편의 타입
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Store = Database['public']['Tables']['stores']['Row']
export type LiveSession = Database['public']['Tables']['live_sessions']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

// 주문 상태 타입
export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'shipped' | 'completed' | 'cancelled'

// 세션 상태 타입
export type SessionStatus = 'active' | 'closed'

