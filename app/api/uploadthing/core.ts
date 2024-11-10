import { getUser } from '@/actions/user/getUser';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = async () => {
    const { user } = await getUser();
    if (!user) throw new Error('unauth');
    return { user };
};

export const ourFileRouter = {
    UserImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    messageFile: f(['image', 'pdf'])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;