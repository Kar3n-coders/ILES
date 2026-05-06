function Toggle ({ on }) {
    return (
        <div style = {{
            width: 36, height: 20, borderRadius: 999,
            background: on ? " var(--color-primary)" : "var(--color-border-strong)",
        }}
    )
}