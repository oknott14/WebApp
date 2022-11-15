export interface SpotifyHttpResponse {
 data: any,
 success: boolean,
 authUrl?: string,
 redirectUrl?: string,
 error?: any,
 message: string   
}

export interface Playlist {
    id: string,
    name: string,
    description: string,
    owner: any,
    collaborative: boolean,
    href: string,
    images: Array<any>,
    public: boolean,
    uri: string,
    primary_color: any,
    external_urls: any,
    snapshot_id: string,
    tracks: any,
    type: string,
}

export interface Track {
    id: string,
    spotifyId: string
    uri: string
    analysisId: string
    name: string
    album: any,
    imageUrls: string[],
    artists: any,
    duration: number,
    explicit: boolean
    popularity: string,
    trackNumber: number,
    danceability: number,
    energy: number,
    key: number,
    loudness: number,
    mode: number,
    speechiness: number,
    acousticness: number,
    instrumentalness: number,
    liveness: number,
    valence: number,
    tempo: number,
    time_signature: number,
}

export interface Album {
    id: string,
    name: string,
    album_type: string,
    artists: Artist [],
    available_markets: string [],
    external_urls: any,
    href: string,
    images: any,
    release_date: string,
    release_date_precision: string,
    total_tracks: number,
    type: string,
    uri: string
}

export interface Image {
    url: string,
    height: number,
    width: number
}

export interface Artist {
    id: string,
    name: string,
    type: string,
    exrernal_urls: any,
    href: string,
    uri: string
}

export interface Device {
    id: string,
    name: string,
    is_active: boolean,
    is_private_session: boolean,
    is_restricted: boolean,
    type: string,
    volume_percent: number
}

export interface PlaybackInfo {
    current_track?: Track,
    progress_ms: number,
    duration_ms: number,
    is_playing: boolean,
    repeat_state: string,
    shuffle_state: boolean
}

export interface AudioFeatures {
    danceability: number,
    energy: number,
    key: number,
    loudness: number,
    mode: number,
    speechiness: number,
    acousticness: number,
    instrumentalness: number,
    liveness: number,
    valence: number,
    tempo: number,
    time_signature: number,
}