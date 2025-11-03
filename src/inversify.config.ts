import { Container } from "inversify";
import { AuthController } from './controllers/authController';
import { PointsController } from './controllers/pointController';
import { GeoPointRepository } from './repositories/GeoPointRepository';
import { UserRepository } from './repositories/UserRepository';
import { AuthService } from './services/AuthService';
import { GeoPointService } from './services/GeoPointService';
import { TYPES } from "./types/types";

const container = new Container();

container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

container.bind<PointsController>(TYPES.PointController).to(PointsController);
container.bind<GeoPointService>(TYPES.GeoPointService).to(GeoPointService);
container.bind<GeoPointRepository>(TYPES.GeoPointRepository).to(GeoPointRepository);

export { container };