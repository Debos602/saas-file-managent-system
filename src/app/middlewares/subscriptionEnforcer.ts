import prisma from "../../shared/prisma";

export const getActivePackageForUser = async (userId: string) => {
    const active = await prisma.userSubscription.findFirst({
        where: {
            userId,
            OR: [
                { endDate: null },
                { endDate: { gt: new Date() } }
            ]
        },
        include: { package: true },
        orderBy: { startDate: 'desc' }
    });

    return active?.package ?? null;
};

export const mapMimeToType = (originalName: string, mimeType?: string) => {
    const name = originalName.toLowerCase();
    if (mimeType) {
        if (mimeType.startsWith('image/')) return 'Image';
        if (mimeType.startsWith('video/')) return 'Video';
        if (mimeType === 'application/pdf') return 'PDF';
        if (mimeType.startsWith('audio/')) return 'Audio';
    }

    if (name.match(/\.jpe?g|\.png|\.gif|\.bmp|\.webp$/)) return 'Image';
    if (name.match(/\.mp4|\.mov|\.mkv|\.avi|\.webm$/)) return 'Video';
    if (name.endsWith('.pdf')) return 'PDF';
    if (name.match(/\.mp3|\.wav|\.ogg|\.m4a$/)) return 'Audio';

    return 'Unknown';
};
