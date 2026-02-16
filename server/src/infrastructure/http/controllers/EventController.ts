import { Request, Response } from 'express';
import { SupabaseEventRepository } from '../../repositories/SupabaseEventRepository';

const eventRepository = new SupabaseEventRepository();

export class EventController {
    async trackEvent(req: Request, res: Response) {
        try {
            const { user_id, customer_id, product_id, event_type, metadata } = req.body;
            
            await eventRepository.save({
                user_id,
                customer_id,
                product_id,
                event_type,
                metadata
            });

            res.status(201).json({ message: 'Event tracked successfully' });
        } catch (error) {
            console.error('Error tracking event:', error);
            res.status(500).json({ error: 'Failed to track event' });
        }
    }

    async getEvents(req: Request, res: Response) {
        try {
            const { type } = req.query;
            const events = await eventRepository.getEvents(type as string);
            res.json(events);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    }
}
