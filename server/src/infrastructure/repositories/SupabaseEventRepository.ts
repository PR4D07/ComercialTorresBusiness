import { supabase } from '../config/supabase';

export interface Event {
    id?: number;
    user_id?: string;
    customer_id?: string;
    product_id?: number;
    event_type: 'view_product' | 'add_to_cart' | 'purchase' | 'search' | 'login' | 'logout' | 'whatsapp_click';
    metadata?: any;
    timestamp?: Date;
}

export class SupabaseEventRepository {
    async save(event: Event): Promise<void> {
        const { error } = await supabase
            .from('events')
            .insert({
                user_id: event.user_id,
                customer_id: event.customer_id,
                product_id: event.product_id,
                event_type: event.event_type,
                metadata: event.metadata
            });
        
        if (error) {
            console.error('Error saving event:', error);
            throw new Error(error.message);
        }
    }

    async getEvents(eventType?: string): Promise<Event[]> {
        let query = supabase.from('events').select('*');
        
        if (eventType) {
            query = query.eq('event_type', eventType);
        }

        const { data, error } = await query;
        
        if (error) {
            throw new Error(error.message);
        }
        
        return data as Event[];
    }
}
