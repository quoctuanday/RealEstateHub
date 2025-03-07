// src/types/goong.ts

export interface MatchedSubstring {
    offset: number;
    length: number;
}

export interface Term {
    value: string;
    offset: number;
}

export interface StructuredFormatting {
    main_text: string;
    secondary_text: string;
}

export interface PlusCode {
    compound_code: string;
    global_code: string;
}

export interface Suggestion {
    description: string;
    matched_substrings: MatchedSubstring[];
    place_id: string;
    reference: string;
    structured_formatting: StructuredFormatting;
    terms: Term[];
    has_children: boolean;
    display_type: string;
    score: number;
    plus_code: PlusCode;
}

export interface PlaceDetail {
    name: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}
