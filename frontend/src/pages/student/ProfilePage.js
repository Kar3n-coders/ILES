function Toggle ({ on }) {
    return (
        <div style = {{
            width: 36, height: 20, borderRadius: 999,
            background: on ? " var(--color-primary)" : "var(--color-border-strong)",
            position: "relative", flexShrink: 0,
        }}>
            <div style={{
                width: 16, height: 16, borderRadius: 999, background: #fff,
                position: "absolute", top: 2, left: on ? 18 : 2,
                transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
        </div>
    )
}