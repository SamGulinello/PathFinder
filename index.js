const container = document.getElementById('maze-container');
const numRows = 40;
const numCols = 90;
const numCells = numRows * numCols;

const grid = Array.from({ length: numRows }, () => Array(numCols).fill(1));

let src
let dest

class Node {
    constructor(parent, position) {
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = parent;
        this.position = position;
    }
}

// Return node with the lowest f value
function getLowest(nodes) {
    let min = nodes[0];
    for (let node of nodes) {
        if (node.f < min.f) {
            min = node;
        }
    }
    return min;
}

// Calculate Manhattan distance as heuristic
function heuristic(pos0, pos1) {
    let d1 = Math.abs(pos1[0] - pos0[0]);
    let d2 = Math.abs(pos1[1] - pos0[1]);
    return d1 + d2;
}

// Function to draw path with delay
function drawPath(path) {
    const dots = document.querySelectorAll('.dot');
    let i = 0;

    // Delay for each step in milliseconds
    const delay = 100;

    path.forEach((pos, index) => {
        setTimeout(() => {
            // Convert path position to grid index
            let gridIndex = pos[0] * numCols + pos[1];
            dots[gridIndex].classList.add('path');
        }, index * delay);
    });
}

// Find path using A* from src to dest
function findPath() {
    const start_node = new Node(null, src);
    const end_node = new Node(null, dest);
    start_node.g = 0;
    start_node.h = heuristic(src, dest);
    start_node.f = start_node.g + start_node.h;

    let open_list = [start_node];
    let closed_list = [];

    while (open_list.length > 0) {
        let current_node = getLowest(open_list);

        // Check if we reached the destination
        if (current_node.position[0] === end_node.position[0] &&
            current_node.position[1] === end_node.position[1]) {
            
            // Backtrack to get the path
            let path = [];
            while (current_node != null) {
                path.push(current_node.position);
                current_node = current_node.parent;
            }

            // path.reverse(); // Reverse the path to get it from start to end
            // console.log("Path found:", path);

            drawPath(path.reverse())

            return current_node; // Trace path back using parent nodes
        }

        // Move current node to closed list
        open_list.splice(open_list.indexOf(current_node), 1);
        closed_list.push(current_node);

        // Generate neighbors (up, down, left, right)
        let neighbors = [
            [current_node.position[0] - 1, current_node.position[1]],
            [current_node.position[0] + 1, current_node.position[1]],
            [current_node.position[0], current_node.position[1] - 1],
            [current_node.position[0], current_node.position[1] + 1]
        ];

        for (let pos of neighbors) {
            // Check if the position is within bounds and walkable (grid value 0)
            if (pos[0] < 0 || pos[0] >= grid.length || pos[1] < 0 || pos[1] >= grid[0].length || grid[pos[0]][pos[1]] == 1) {
                continue;
            }

            let new_node = new Node(current_node, pos);

            // Skip if the node is in the closed list
            if (closed_list.some(node => node.position[0] === pos[0] && node.position[1] === pos[1])) {
                continue;
            }

            // Calculate g, h, and f
            new_node.g = current_node.g + 1;
            new_node.h = heuristic(new_node.position, end_node.position);
            new_node.f = new_node.g + new_node.h;

            // If node is in open list with lower f, skip
            let existing_node = open_list.find(node => node.position[0] === pos[0] && node.position[1] === pos[1]);
            if (existing_node && existing_node.f <= new_node.f) {
                continue;
            }

            open_list.push(new_node);
        }
    }

    console.log("No path found");
    generateMaze()
    return null; // No path found
}


// Create grid of dots
function createGrid() {

    const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.remove()
    });


    for (let i = 0; i < numRows * numCols; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        container.appendChild(dot);
    }
}

// Simple maze generation (random paths for now)
function generateMaze() {

    createGrid();
    src = [Math.floor(Math.random() * numRows), Math.floor(Math.random() * numCols)]
    dest = [Math.floor(Math.random() * numRows), Math.floor(Math.random() * numCols)]

    console.log(src)
    console.log(dest)

    const dots = document.querySelectorAll('.dot');
    let i = 0;

    dots.forEach(dot => {
        let row_index = Math.floor(i / numCols);
        let col_index = i % numCols;

        if (row_index === src[0] && col_index === src[1]) {
            dot.classList.add('start');
            grid[row_index][col_index] = 0; // Ensure start cell is walkable
        } else if (row_index === dest[0] && col_index === dest[1]) {
            dot.classList.add('end');
            grid[row_index][col_index] = 0; // Ensure end cell is walkable
        } else if (Math.random() > 0.2) {
            dot.classList.add('field');
            grid[row_index][col_index] = 0;
        } else {
            dot.classList.remove('field');
            grid[row_index][col_index] = 1;
        }
        i += 1;
    });
    console.log(grid);
}

createGrid()
