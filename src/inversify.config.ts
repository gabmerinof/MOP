import { Container } from "inversify";
import { AuthController } from './controllers/authController';
import { PointsController } from './controllers/pointController';
import { GeoPointRepository } from './repositories/GeoPointRepository';
import { IGeoPointRepository, IUserRepository } from "./repositories/interfaces";
import { UserRepository } from './repositories/UserRepository';
import { AuthService } from './services/AuthService';
import { GeoPointService } from './services/GeoPointService';
import { IAuthService, IGeoPointService } from "./services/interfaces";
import { TYPES } from "./types/types";

const container = new Container();

container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

container.bind<PointsController>(TYPES.PointController).to(PointsController);
container.bind<IGeoPointService>(TYPES.GeoPointService).to(GeoPointService);
container.bind<IGeoPointRepository>(TYPES.GeoPointRepository).to(GeoPointRepository);

export { container };

