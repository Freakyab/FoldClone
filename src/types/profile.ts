interface User {
    username: string;
    avatarUrl?: string;
}

interface Connections {
    bankAccounts: number;
    creditCards: number;
    investments: number;
    creditReports: number;
}

interface Statistics {
    taggedPercentage: number;
    merchantPercentage: number;
}

interface CreditScore {
    value: number | null;
    status: "not_fetched" | "loading" | "fetched" | "error";
}

export type { CreditScore, User, Connections, Statistics };