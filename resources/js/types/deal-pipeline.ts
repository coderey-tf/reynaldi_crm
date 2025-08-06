export type DealProduct = {
    productId: string,
    productName: string,
    hpp:number,
    hargaJualAsli: number,
    hargaNegoisasi: number,
    quantity: number,
    needsApproval: boolean
    approvalStatus?: "pending" | "approved" | "rejected"
}

export type DealPipeline = {
    id: string,
    leadId: string,
    deal_product: DealProduct[],
    notes: string,
    totalValue: number,
    totalProfit: number,
    profitMargin: number,
    status: "draft" | "waiting-approval" | "approved" | "rejected" | "closed"
    approvedBy?: string
    approvedDate?: string
}
