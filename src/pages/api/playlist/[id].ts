import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "~/libraries/mongoose.library";
import { Playlist } from "~/models/Playlist.model";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    const { id } = req.query;
    await dbConnect();
    if (req.method === "GET") {
        const playlists = await getPlaylist(id as string);
        res.status(200).send({ data: playlists });
    } else if (req.method === "DELETE") {
        await removePlaylist(id as string);
        res.status(200).send({ data: null });
    }
}

async function getPlaylist(id: string) {
    const result = await Playlist.findById(id);
    if (!result) return null;
    const playlist = result.toObject();
    return {
        color: playlist.color,
        id: playlist._id.toString(),
        name: playlist.name,
        owner: playlist.owner,
        slug: playlist.slug,
        spotifyId: playlist.spotifyId,
        upvote: playlist.upvote,
    };
}

async function removePlaylist(id: string) {
    await Playlist.findByIdAndDelete(id);
}

export type Response = any;
