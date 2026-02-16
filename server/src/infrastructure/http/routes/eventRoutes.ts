import { Router } from 'express';
import { EventController } from '../controllers/EventController';

const router = Router();
const eventController = new EventController();

router.post('/', (req, res) => eventController.trackEvent(req, res));
router.get('/', (req, res) => eventController.getEvents(req, res));

export default router;
