// Assign the specification to a local variable.
var daily_and_cumulative_cases_spec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  autosize: 'fit',
  width: 'container',
  height: 'container',
  //data: {'url': 'covid-19-cases-by-notification-date-and-postcode-local-health-district-and-local-government-area.csv'},
  data: {'url': 'https://davidwales.github.io/nsw-covid-19-data/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'},
  transform: [
    {
      filter: {field: 'lhd_2010_name', equal: 'South Western Sydney'}
    },
    {
      window: [{op: 'count', field: 'notification_date', as: 'cumulative_count'}],
      frame: [null,0]
    }
  ],
  layer: [
    {
      mark: 'bar',
      encoding: {
        x: {timeUnit: 'yearmonthdate', field: 'notification_date', type: 'temporal'},
        y: {
          aggregate: 'count',
          field: 'lga_name19',
          type: 'quantitative',
          axis: {
            title: 'Daily Cases'
          }
        },
        color: {field: 'lga_name19', type: 'nominal'}
      },
    },
    {
      mark: 'line',
      encoding: {
        x: {timeUnit: 'yearmonthdate', field: 'notification_date', title: 'Date', type: 'temporal'},
        y: {
          aggregate: 'max',
          field: 'cumulative_count',
          type: 'quantitative',
          axis: {
            title: 'Cumulative Daily Cases'
          }
        }
      }
    }
  ],
  resolve: {scale: {y: 'independent'}}
};

// Embed the visualization in the container with id `vis`
//vegaEmbed('#vis', vlSpec);
vegaEmbed('#daily_and_cumulative_cases', daily_and_cumulative_cases_spec);
