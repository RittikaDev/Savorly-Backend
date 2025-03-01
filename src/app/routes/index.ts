import { Router } from 'express';
import { CarRoute } from '../modules/car/car.route';
import { OrderRoute } from '../modules/order/order.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoute } from '../modules/user/user.route';
import { MealRoute } from '../modules/meal/meal.route';
import { MealProviderRoutes } from '../modules/meal_provider/meal_provider.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/meal-provider',
    route: MealProviderRoutes,
  },
  {
    path: '/cars',
    route: CarRoute,
  },
  {
    path: '/meals',
    route: MealRoute,
  },
  {
    path: '/orders',
    route: OrderRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
