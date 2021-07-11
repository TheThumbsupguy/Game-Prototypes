export default function getVehicles(context) {
  const redVehicleData = [
    '.....3.......',
    '....333......',
    '..5333445....',
    '.333333233...',
    '33333333333..',
    '37773337773..',
    '38587778583..',
    '38588888583..',
    '37888888873..',
    '.333333333...',
    '...6555....F.',
    '..6.7576.43E3',
    '..5.666.55.E.',
    '..5.777......',
    '....7..6.....',
    '....7..7.....'
  ];
  context.textures.generate('redVehicle', { data: redVehicleData, pixelWidth: 3, pixelHeight: 3 });

  const greenVehicleData = [
    '....DDDDDDDD....',
    '...DDEEDDDDDD...',
    '..DDDEEDDDDDDD..',
    '..DDDDDDDDDDDD..',
    '..DDDD5555DDDD..',
    '..DDD555555DDD..',
    '..DDD555555DDD..',
    '..DDD555555DDD..',
    '..334244333333..',
    '.33344443333333.',
    '3333444433333333',
    '....5...5..5....',
    '...5....5...5...',
    '.66....66....66.',
    '.66....66....66.'
  ];
  context.textures.generate('greenVehicle', { data: greenVehicleData, pixelWidth: 3, pixelHeight: 3 });

  const yellowVehicleData = [
    '.....DEEEEEED...',
    '.....EEEEEFFE...',
    '.....EEEDDFFE...',
    '334..EEDDDDEE...',
    '3333.EEDDDDEE...',
    '33333EEDDDDEE...',
    '.FF2222222222F..',
    '.F222222222222F.',
    '.22222222222222F',
    '4443322222222222',
    '44433FFFFFFFFFFF',
    '.111FFFFFFFFFFF.',
    '.11FFFFFFFFFFF..',
    '.1FFFFFFFFFF1...',
    '...3333.........',
    '...333..........'
  ];
  context.textures.generate('yellowVehicle', { data: yellowVehicleData, pixelWidth: 3, pixelHeight: 3 });

  const vehicleConfig = [
    { color: '0xff0000', x: 8, y: 16, name: 'red', textureName: 'redVehicle' },
    { color: '0xffff00', x: 40, y: context.game.config.height / 2 - 8, name: 'yellow', textureName: 'yellowVehicle' },
    //{ color: '0x0000ff', x: 72, y: context.game.config.height - 64, name: 'blue', textureName: 'redVehicle' },
    //{ color: '0xff6600', x: context.game.config.width - 128, y: 16, name: 'orange', textureName: 'orangeVehicle' },
    { color: '0x00ff00', x: context.game.config.width - 64, y: context.game.config.height / 2 - 8, name: 'green', textureName: 'greenVehicle' },
    //{ color: '0x6600ff', x: context.game.config.width - 96, y: context.game.config.height - 64, name: 'purple', textureName: 'redVehicle' },
  ];

  const vehicles = context.physics.add.group();

  for (let index = 0; index < vehicleConfig.length; index++) {
    const { color, x, y, name, textureName } = vehicleConfig[index];
    let vehicle;
    if (textureName) {
      vehicle = context.add.image(x, y, textureName)
    } else {
      vehicle = context.add.rectangle(x, y, 24, 24, color)
    }
    vehicle.setOrigin(0, 0).setName(name);
    vehicles.add(vehicle);
  }

  return vehicles;
}
