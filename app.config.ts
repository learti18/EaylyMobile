import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "EatlyMobile",
  slug: config.slug ?? "eatlymobile",
  extra: {
    EXPO_PUBLISHABLE_STRIPE: process.env.EXPO_PUBLISHABLE_STRIPE ?? "",
  },
});
