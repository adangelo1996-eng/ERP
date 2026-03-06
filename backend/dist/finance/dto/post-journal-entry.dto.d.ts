declare class JournalLineDto {
    accountId: string;
    debit: string;
    credit: string;
    description?: string;
}
export declare class PostJournalEntryDto {
    ledgerId: string;
    postingDate: string;
    reference: string;
    source: string;
    lines: JournalLineDto[];
}
export {};
