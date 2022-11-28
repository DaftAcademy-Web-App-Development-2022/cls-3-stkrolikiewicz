import type { NextApiRequest, NextApiResponse } from "next";
import { requestToBodyStream } from "next/dist/server/body-streams";
import { dbConnect } from "~/libraries/mongoose.library";
import { Playlist } from "~/models/Playlist.model";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    await dbConnect();

    if (req.method === "GET") {
        const playlists = await getPlaylists();
        res.status(200).send({ data: playlists });
    } else if (req.method === "POST") {
        await createPlaylist(req.body);
        res.status(201).send({
            data: {
                color: req.body.color || "#000000",
                name: req.body.name,
                owner: req.body.owner,
                slug: req.body.slug,
                spotifyId: req.body.spotifyId,
                upvote: req.body.upvote,
            },
        });
    }
}

async function getPlaylists() {
    const result = await Playlist.find();
    return result.map((doc) => {
        return {
            color: doc.color,
            id: doc._id,
            name: doc.name,
            owner: doc.owner,
            slug: doc.slug,
            spotifyId: doc.spotifyId,
            upvote: doc.upvote,
        };
    });
}

async function createPlaylist(obj: unknown) {
    await Playlist.create(obj);
}

export type Response = any;
