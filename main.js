$.ajax({
  type: 'GET',
  url: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100',
  dataType: 'json',
  success: function (data) {
    let pokemonList = [...data.results];

    let pokemonURL = pokemonList.map((pok) => {
      return $.ajax({
        type: 'GET',
        url: pok.url,
        dataType: 'json',
      });
    });

    Promise.all(pokemonURL).then(function (pokemonData) {
      let pokemonDetails = pokemonList.map((pok, index) => {
        return {
          id: pokemonData[index].id,
          name: pok.name,
          height: pokemonData[index].height,
          weight: pokemonData[index].weight,
          types: pokemonData[index].types,
          sprites: pokemonData[index].sprites,
        };
      });

      $('#table').DataTable({
        responsive: true,
        data: pokemonDetails,
        columns: [
          { data: 'id' },
          { data: 'name' },
          { data: 'height' },
          { data: 'weight' },
          {
            data: null,
            render: function (data) {
              return data.types
                .map(function (type) {
                  return type.type.name;
                })
                .join(', ');
            },
          },
          {
            data: 'sprites',
            render: function (data) {
              return '<img src="' + data.front_default + '"/>';
            },
          },
        ],
      });
    });
  },
});
