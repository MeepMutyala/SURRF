import { NetworkGraph } from 'react-vis-network-graph';

const [data, setData] = useState({
    nodes: [
    { id: 1, label: 'Main' },
    { id: 2, label: 'Left' },
    { id: 3, label: 'Center' },
    { id: 4, label: 'Right' },
    { id: 5, label: 'Back' },
    ],
    edges: [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 5, target: 1 },
    ],
});

export default function Graph() {

    return (
        <div>
        <NetworkGraph data={data} />
        </div>
    );
}