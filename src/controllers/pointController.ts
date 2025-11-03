import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { GeoPointService } from '../services/GeoPointService';
import { TYPES } from '../types/types';
import { AppError } from '../utils/AppError';

@injectable()
export class PointsController {

    constructor(@inject(TYPES.GeoPointService) private readonly geoPointService: GeoPointService) {
    }

    createPoint = async (req: Request, res: Response): Promise<void> => {
        try {
            const point = await this.geoPointService.createPoint(req.body);

            res.status(201).json({ ...point });
        } catch (error: any) {
            throw new AppError('GEOPOINT_ERROR', error.message, 400);
        }
    };

    getPoints = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters = {
                type: req.query['type'] as string,
                lat: req.query['lat'] ? parseFloat(req.query['lat'] as string) : undefined,
                long: req.query['long'] ? parseFloat(req.query['long'] as string) : undefined,
                radius: req.query['radius'] ? parseFloat(req.query['radius'] as string) : undefined,
            };
            const points = await this.geoPointService.getAllPoints(filters);

            res.status(200).json({
                points: points,
                count: points?.length
            });
        } catch (error: any) {
            throw new AppError('GEOPOINT_ERROR', error.message, 400);
        }
    };

    getPointById = async (req: Request, res: Response): Promise<void> => {
        try {
            const geoPointId = req.params['geoPointId']!;
            const point = await this.geoPointService.getPointById(geoPointId);
            if (!point) throw new Error('Punto Georeferencial no encontrado');

            res.status(200).json({ ...point });
        } catch (error: any) {
            throw new AppError('GEOPOINT_ERROR', error.message, 400);
        }
    };

    updatePoint = async (req: Request, res: Response): Promise<void> => {
        try {
            const userid = (req as any).body.userid;
            const point = await this.geoPointService.updatePoint(req.params['geoPointId']!, req.body, userid);
            if (!point) throw new Error('Punto Georeferencial no encontrado');

            res.status(200).json({ ...point });
        } catch (error: any) {
            const errorNo = error.message.includes('permisos') ? 403 : 400;
            throw new AppError('GEOPOINT_ERROR', error.message, errorNo);
        }
    };

    deletePoint = async (req: Request, res: Response): Promise<void> => {
        try {
            const userid = (req as any).body.userid;
            const success = await this.geoPointService.deletePoint(req.params['geoPointId']!, userid);
            if (!success) throw new Error('Error al eliminar el Punto Georeferencial');

            res.status(200).json({ "message": "Punto eliminado con éxito" });
        } catch (error: any) {
            const errorNo = error.message.includes('permisos') ? 403 : 400;
            throw new AppError('GEOPOINT_ERROR', error.message, errorNo);
        }
    };

    getUserPoints = async (req: Request, res: Response): Promise<void> => {
        try {
            const userid = req.params['userid']!;
            const points = await this.geoPointService.getUserPoints(userid);

            res.status(200).json({
                points: points,
                count: points?.length
            });
        } catch (error: any) {
            throw new AppError('GEOPOINT_ERROR', error.message, 400);
        }
    };
}