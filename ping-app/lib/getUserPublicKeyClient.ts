import getUserPublicKey from "@/actions/user/getUserPublicKey";

const publicKeyCache = new Map<string, Promise<string | undefined | null>>();

export default function getUserPublicKeyClient(userId: string): Promise<string | undefined | null> {
    if (!publicKeyCache.has(userId)) {
        const promise = getUserPublicKey(userId);
        publicKeyCache.set(userId, promise);
        
        promise.catch(() => {
            // If the request fails, remove it from cache so it can be retried
            publicKeyCache.delete(userId);
        });
    }
    
    return publicKeyCache.get(userId)!;
}
