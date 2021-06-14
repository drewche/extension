import { Grid } from '../components';

export default function Home() {

    const onLayoutChange = (layout) => {

    }

    const props = {
        className: "layout",
        onLayoutChange: onLayoutChange,
        compactType: "vertical",
        isBounded: true,
        defaultItems: [
            {"w":3,"h":4,"x":0,"y":0,"i":"0","moved":false,"static":false,"resizeHandles":["s","w","e","n","se"]},
            {"w":4,"h":2,"x":3,"y":0,"i":"1","moved":false,"static":false,"resizeHandles":["s","w","e","n","se"]},
            {"w":4,"h":2,"x":3,"y":2,"i":"2","moved":false,"static":false,"resizeHandles":["s","w","e","n","se"]},
            {"w":3,"h":4,"x":7,"y":0,"i":"3","moved":false,"static":false,"resizeHandles":["s","w","e","n","se"]},
            // {"w":2,"h":2,"x":10,"y":0,"i":"+","moved":false,"static":false,"resizeHandles":["s","w","e","n","se"]},
        ],
    };

    const containerStyles = {
        width:"100vw", 
        height:"100vh",
    }

    return (
        <>
            <div style={containerStyles}>
                <Grid {...props}/>
            </div>
        </>
    )
}