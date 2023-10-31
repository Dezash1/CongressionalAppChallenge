import React, { useEffect, useState } from 'react';

export default function DataPoint(props) {
    const {data} = props;

    const [hover, setHover] = useState(false);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <p style={{width: '80%'}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{data.name}</p>
            {hover && <p style={{color: data.good ? "green" : "red"}}>{data.value}</p>}
        </div>
    );
}