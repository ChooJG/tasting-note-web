/**
 * Sip API 타입 정의
 * 새 OpenAPI 3.1 스펙 기반 (2026-04-19)
 */

export interface components {
  schemas: {
    NoteResponse: {
      /** Format: int64 */
      id?: number;
      /** Format: int64 */
      userId?: number;
      /** Format: int64 */
      alcoholId?: number;
      alcoholName?: string;
      alcoholNameKo?: string;
      customAlcoholName?: string;
      title?: string;
      taste?: string;
      aroma?: string;
      imageUrls?: string[];
      pairing?: string;
      /** Format: double */
      rating?: number;
      description?: string;
      isPublic?: boolean;
      /** @enum {string} */
      status?: "DRAFT" | "PUBLISHED";
      /** Format: date */
      drankAt?: string;
      location?: string;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
    };
    NoteCreateRequest: {
      /** Format: int64 */
      alcoholId?: number;
      customAlcoholName?: string;
      title?: string;
      taste?: string;
      aroma?: string;
      pairing?: string;
      /** Format: double, min 0.5, max 5 */
      rating: number;
      description?: string;
      /** Format: date */
      drankAt?: string;
      location?: string;
      isPublic?: boolean;
    };
    NoteUpdateRequest: {
      /** Format: int64 */
      alcoholId?: number;
      customAlcoholName?: string;
      title?: string;
      taste?: string;
      aroma?: string;
      pairing?: string;
      /** Format: double, min 0.5, max 5 */
      rating: number;
      description?: string;
      /** Format: date */
      drankAt?: string;
      location?: string;
      isPublic: boolean;
    };
    ReportRequest: {
      /** @enum {string} */
      reason: "SPAM" | "INAPPROPRIATE" | "FALSE_INFO" | "OTHER";
      reasonDetail?: string;
    };
    FeedbackRequest: {
      /** @enum {string} */
      category: "BUG" | "FEEDBACK" | "SUGGESTION";
      content?: string;
      appVersion?: string;
    };
    SignUpRequest: {
      email: string;
      password: string;
      nickname: string;
      /** Format: date */
      birthDate?: string;
    };
    TokenResponse: {
      accessToken?: string;
      refreshToken?: string;
    };
    LoginRequest: {
      email: string;
      password: string;
    };
    FlavorSuggestionResponse: {
      /** Format: int64 */
      id?: number;
      name?: string;
    };
    AlcoholResponse: {
      /** Format: int64 */
      id?: number;
      name?: string;
      nameKo?: string;
      /** @enum {string} */
      category?: "WHISKEY" | "WINE" | "BEER" | "SOJU" | "MAKGEOLLI" | "SAKE" | "VODKA" | "GIN" | "RUM" | "TEQUILA" | "BRANDY" | "COCKTAIL" | "ETC";
      categoryKo?: string;
      origin?: string;
      region?: string;
      /** Format: int32 */
      vintage?: number;
      /** Format: double */
      abv?: number;
      description?: string;
    };
    AlcoholRequestCreateRequest: {
      name?: string;
      nameKo?: string;
      aliases?: string[];
      reason?: string;
      /** @enum {string} */
      category?: "WHISKEY" | "WINE" | "BEER" | "SOJU" | "MAKGEOLLI" | "SAKE" | "VODKA" | "GIN" | "RUM" | "TEQUILA" | "BRANDY" | "COCKTAIL" | "ETC";
    };
    AlcoholAliasCreateRequest: {
      alias?: string;
      reason?: string;
    };
    ProfileImageResponse: {
      profileImageUrl?: string;
    };
    UpdatePasswordRequest: {
      currentPassword: string;
      newPassword: string;
    };
    UpdateNicknameRequest: {
      nickname: string;
    };
    AlcoholRequestResponse: {
      /** Format: int64 */
      id?: number;
      /** @enum {string} */
      type?: "NEW" | "ALIAS";
      name?: string;
      nameKo?: string;
      aliases?: string[];
      reason?: string;
      rejectReason?: string;
      /** @enum {string} */
      category?: "WHISKEY" | "WINE" | "BEER" | "SOJU" | "MAKGEOLLI" | "SAKE" | "VODKA" | "GIN" | "RUM" | "TEQUILA" | "BRANDY" | "COCKTAIL" | "ETC";
      /** @enum {string} */
      status?: "PENDING" | "APPROVED" | "REJECTED";
      /** Format: int64 */
      requestedById?: number;
      requestedByNickname?: string;
      /** Format: int64 */
      targetAlcoholId?: number;
      targetAlcoholName?: string;
      /** Format: date-time */
      createdAt?: string;
      similarAlcohols?: components["schemas"]["AlcoholResponse"][];
    };
  };
}
