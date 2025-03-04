import { Router } from 'express';
import { OrderRoute } from '../modules/order/order.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoute } from '../modules/user/user.route';
import { MealRoute } from '../modules/meal/meal.route';
import { MealProviderRoutes } from '../modules/meal_provider/meal_provider.route';
import { MealPreferenceRoute } from '../modules/meal_preference/meal_preference.route';
import { CustomerRoute } from '../modules/user/customer.route';
import { ProviderRoute } from '../modules/user/provider.route';

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
    path: '/meal-preference',
    route: MealPreferenceRoute,
  },
  {
    path: '/meals',
    route: MealRoute,
  },
  {
    path: '/orders',
    route: OrderRoute,
  },
  {
    path: '/customers',
    route: CustomerRoute,
  },
  {
    path: '/providers',
    route: ProviderRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
