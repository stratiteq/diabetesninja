import { Navigation } from 'react-native-navigation';
import LoginScreen from './LoginScreen';
import SignUpCompleteScreen from './SignUpCompleteScreen';
import DashboardScreen from './DashboardScreen';
import LogBloodSugar from './LogBloodSugarScreen';
import LogMeal from './LogMeal';
import LogNote from './LogNoteScreen';
import InviteScreen from './InviteScreen';
import FollowScreen from './FollowScreen';
import AddFoodScreen from './AddFoodScreen';
import AddCustomCarbsScreen from './AddCustomCarbsScreen';
import SideBar from '../components/navigation/SideBar';
import LoadingNavButton from '../components/navigation/LoadingNavButton';
import TermsAndConditions from './TermsAndConditions';
import EventLogDetailsScreen from './EventLogDetailsScreen';
import SignUpScreen from './SignUpScreen';
import ForgottenPassword from './ForgottenPassword';
import About from './About';
import AboutDiabetesScreen from './AboutDiabetesScreen';
import UserAccountScreen from './UserAccountScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import ChangeUserNameScreen from './ChangeUserNameScreen';
import CalculateInsulinScreen from './CalculateInsulinScreen';

// register all screens of the app (including internal ones)
// eslint-disable-next-line import/prefer-default-export
export function registerScreens(store, provider) {
  // HACK: Only for iOS
  Navigation.registerComponent(
    'DiabetesNinjaApp',
    () => LoginScreen,
    store,
    provider,
  );

  Navigation.registerComponent(
    'diabetesNinja.LoginScreen',
    () => LoginScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.SignUpScreen',
    () => SignUpScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.SignUpCompleteScreen',
    () => SignUpCompleteScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.DashboardScreen',
    () => DashboardScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.EventLogDetailsScreen',
    () => EventLogDetailsScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.LogBloodSugar',
    () => LogBloodSugar,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.LogMeal',
    () => LogMeal,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.LogNote',
    () => LogNote,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.AddFood',
    () => AddFoodScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.AddCustomCarbs',
    () => AddCustomCarbsScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.InviteScreen',
    () => InviteScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.FollowScreen',
    () => FollowScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.UserAccountScreen',
    () => UserAccountScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.ChangePasswordScreen',
    () => ChangePasswordScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.ChangeUserNameScreen',
    () => ChangeUserNameScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.SideBar',
    () => SideBar,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.LoadingNavButton',
    () => LoadingNavButton,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.TermsAndConditions',
    () => TermsAndConditions,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.About',
    () => About,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.AboutDiabetesScreen',
    () => AboutDiabetesScreen,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.ForgottenPassword',
    () => ForgottenPassword,
    store,
    provider,
  );
  Navigation.registerComponent(
    'diabetesNinja.CalculateInsulin',
    () => CalculateInsulinScreen,
    store,
    provider,
  );
}
