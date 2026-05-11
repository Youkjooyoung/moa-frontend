/**
 * Image Path Utility
 * 방법 A: 문자열 치환 방식으로 DB의 로고 경로를 아이콘 경로로 변환
 * 
 * DB에는 로고 경로만 저장하고, 아이콘은 규칙 기반으로 프론트엔드에서 변환
 * - 로고: /uploads/product-image/Netflix_logo.png
 * - 아이콘: /uploads/product-icon/Netflix_icon.png
 */

/**
 * API Base URL 가져오기
 * @returns {string} - API Base URL
 */
const getApiBaseUrl = () => {
    // Vite 환경변수에서 API URL 가져오기
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    if (/^https?:\/\//i.test(apiBaseUrl)) {
        return new URL(apiBaseUrl).origin;
    }

    const legacyApiUrl = import.meta.env.VITE_API_URL || '';
    if (/^https?:\/\//i.test(legacyApiUrl)) {
        return new URL(legacyApiUrl).origin;
    }

    return '';
};

/**
 * DB에서 받아온 로고 이미지 경로를 완전한 URL로 변환
 * @param {string} imagePath - DB에서 받아온 이미지 경로 (예: /uploads/product-logo/Netflix_logo.png)
 * @returns {string} - 완전한 이미지 URL
 */
export const getProductLogoUrl = (imagePath) => {
    if (!imagePath) return '';

    // 이미 완전한 URL인 경우 그대로 반환
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // 상대 경로인 경우 API Base URL 추가
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}${imagePath}`;
};

/**
 * DB에서 받아온 이미지 경로를 아이콘 경로로 변환
 * 폴더는 동일하게 유지하고 파일명만 변환: _logo.png → _icon.png
 * @param {string} imagePath - DB에서 받아온 이미지 경로 (예: /uploads/product-image/YouTube_logo.png)
 * @returns {string} - 아이콘 경로 (예: /uploads/product-image/YouTube_icon.png)
 */
export const getProductIconUrl = (imagePath) => {
    if (!imagePath) return '';
    if (typeof imagePath === 'object') {
        return getProductImageCandidates(imagePath)[0] || '';
    }

    // 파일명만 변환 (_logo → _icon, 대소문자 모두 처리)
    const iconPath = imagePath.replace(/_[Ll]ogo\./, '_icon.');

    // 이미 완전한 URL인 경우
    if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
        return iconPath;
    }

    // 상대 경로인 경우 API Base URL 추가
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}${iconPath}`;
};

const toAbsoluteImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return '';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    const baseUrl = getApiBaseUrl();
    return `${baseUrl}${imagePath}`;
};

const normalizeImagePath = (path) => {
    if (!path || typeof path !== 'string') return '';
    return path.trim();
};

const pushUnique = (list, value) => {
    if (!value || list.includes(value)) return;
    list.push(value);
};

export const getProductImageCandidates = (productOrPath, variant = 'icon') => {
    const rawPaths = [];

    if (typeof productOrPath === 'string') {
        pushUnique(rawPaths, normalizeImagePath(productOrPath));
    } else if (productOrPath && typeof productOrPath === 'object') {
        const preferredPaths = variant === 'logo'
            ? [
                productOrPath.productThumbnailUrl,
                productOrPath.thumbnailUrl,
                productOrPath.thumbnail,
                productOrPath.productLogoUrl,
                productOrPath.logoUrl,
                productOrPath.logoImage,
                productOrPath.image,
                productOrPath.productImage,
                productOrPath.imageUrl,
                productOrPath.iconUrl,
                productOrPath.productIconUrl,
            ]
            : [
                productOrPath.productIconUrl,
                productOrPath.iconUrl,
                productOrPath.productIcon,
                productOrPath.iconImage,
                productOrPath.icon,
                productOrPath.productLogoUrl,
                productOrPath.logoUrl,
                productOrPath.image,
                productOrPath.productImage,
                productOrPath.imageUrl,
                productOrPath.productThumbnailUrl,
                productOrPath.thumbnailUrl,
                productOrPath.thumbnail,
            ];

        preferredPaths.forEach((path) => pushUnique(rawPaths, normalizeImagePath(path)));
    }

    const candidates = [];

    rawPaths.forEach((path) => {
        const iconPath = path.replace(/_[Ll]ogo\./, '_icon.');
        if (variant === 'logo') {
            pushUnique(candidates, toAbsoluteImageUrl(path));
            pushUnique(candidates, toAbsoluteImageUrl(iconPath));
            return;
        }

        pushUnique(candidates, toAbsoluteImageUrl(iconPath));
        pushUnique(candidates, toAbsoluteImageUrl(path));
    });

    return candidates;
};

/**
 * 이미지 로드 실패 시 대체 이미지 처리
 * @param {Event} event - 이미지 에러 이벤트
 * @param {string} fallbackText - 대체 텍스트 (보통 서비스 이름의 첫 글자)
 */
export const handleImageError = (event, fallbackText = '?') => {
    const target = event.target;

    // 이미지 숨기고 대체 텍스트 표시를 위해 data 속성 설정
    target.style.display = 'none';
    target.dataset.error = 'true';
    target.dataset.fallback = fallbackText;
};

/**
 * 이미지 경로가 유효한지 확인
 * @param {string} imagePath - 확인할 이미지 경로
 * @returns {boolean} - 유효 여부
 */
export const isValidImagePath = (imagePath) => {
    if (!imagePath) return false;
    if (typeof imagePath !== 'string') return false;

    // 기본적인 경로 패턴 확인
    return imagePath.includes('/uploads/') ||
        imagePath.startsWith('http://') ||
        imagePath.startsWith('https://');
};
