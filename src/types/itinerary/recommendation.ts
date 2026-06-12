import type { RecommendationCategory } from "@/constants/itinerary";
import type {
  MediaAsset,
  MetadataRecord,
  Nullable
} from "./shared";

/**
 * Discovery and personalization recommendation entity.
 */
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: RecommendationCategory;
  relevanceScore: number;
  localTip?: string | null;
  recommendedTime?: string | null;
  image?: Nullable<MediaAsset>;
  metadata?: MetadataRecord;
  /**
   * Compatibility alias used by older recommendation flows.
   */
  type?: RecommendationCategory;
}
