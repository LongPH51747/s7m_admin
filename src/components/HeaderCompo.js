const HeaderCompo = ({title, color}) => {
    return (
        <div style={{height: 95, backgroundColor: color, alignItems: 'center', display: "flex" }}>
            <span style={{fontSize: 24, fontWeight: "bold", marginLeft: 35 }}>{title}</span>
        </div>
    )
}

export default HeaderCompo