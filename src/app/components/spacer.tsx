type SpacerProps = {
    base?: number
    md?: number
    lg?: number
}

export default function Spacer() {
    return (
        <div className="h-10 md:h-[120px]" />
    )
}