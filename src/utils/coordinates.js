export const ParseCoordinates = (coor) => {
    const coordinates = coor.split('-');
    const i = parseInt(coordinates[0]);
    const j = parseInt(coordinates[1]);
    return {i, j};
}