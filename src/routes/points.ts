import { Router } from 'express';
import { PointsController } from '../controllers/pointController';
import { container } from "../inversify.config";
import { auth } from '../middleware/auth';
import { validateGeoPoint, validateProximityFilter } from '../middleware/validation';
import { TYPES } from '../types/types';

const router = Router();
const pointsController = container.get<PointsController>(TYPES.PointController);

router.get('/', auth, validateProximityFilter, pointsController.getPoints);
router.get('/:geoPointId', auth, pointsController.getPointById);
router.post('/', auth, validateGeoPoint, pointsController.createPoint);
router.put('/:geoPointId', auth, validateGeoPoint, pointsController.updatePoint);
router.delete('/:geoPointId', auth, pointsController.deletePoint);
router.get('/user/my-points/:userid', auth, pointsController.getUserPoints);

export default router;