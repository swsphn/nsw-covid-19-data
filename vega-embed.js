// Assign the specification to a local variable.

var sws_phn_config = {
  "group": {"fill": "#e5e5e5"},
  "arc": {"fill": "#000000"},
  "area": {"fill": "#000000"},
  "line": {"stroke": "#000000"},
  "path": {"stroke": "#000000"},
  "rect": {"fill": "#000000"},
  "shape": {"stroke": "#000000"},
  "symbol": {"fill": "#000000"},
  "range": {
    "category": [
      "#2283a2",
      "#003e6a",
      "#a1ce5e",
      "#2b2c39",
      "#EF8762",
      "#FDBE13",
      "#F2727E",
      "#EA3F3F",
      "#26213C",
      "#25A9E0",
      "#F97A08",
      "#41BFB8",
      "#518DCA",
      "#9460A8",
      "#6F7D84",
      "#D1DCA5"
    ]
  }
}

var daily_and_cumulative_cases_spec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  //autosize: 'fit',
  width: 'container',
  height: 'container',
  config: sws_phn_config,
  data: {url: 'https://davidwales.github.io/nsw-covid-19-data/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'},
  transform: [
    {
      filter: {
        and: [
          {field: 'lhd_2010_name', equal: 'South Western Sydney'},
          {not: {field: 'lga_name19', equal: 'Penrith (C)'}}
        ]
      }
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
            title: 'Daily Cases by SWS LGA'
          }
        },
        color: {field: 'lga_name19', type: 'nominal', legend: {title: 'LGA'}}
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
            title: 'Cumulative Cases'
          }
        }
      }
    }
  ],
  resolve: {scale: {y: 'independent'}}
};

var daily_cases_by_transmission_and_daily_tests_spec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  //autosize: 'fit',
  width: 'container',
  height: 'container',
  config: sws_phn_config,
  layer: [
    {
      data: {url: 'https://davidwales.github.io/nsw-covid-19-data/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'},
      transform: [
        {
          filter: {
            and: [
              {field: 'lhd_2010_name', equal: 'South Western Sydney'},
              {not: {field: 'lga_name19', equal: 'Penrith (C)'}}
            ]
          }
        }
      ],
      mark: 'bar',
      encoding: {
        x: {timeUnit: 'yearmonthdate', field: 'notification_date', type: 'temporal'},
        y: {
          aggregate: 'count',
          field: 'likely_source_of_infection',
          type: 'quantitative',
          axis: {
            title: 'Daily Cases by Infection Source'
          }
        },
        color: {field: 'likely_source_of_infection', type: 'nominal', legend: {title: 'Infection Source'}}
      }
    },
    {
      data: {url: 'https://davidwales.github.io/nsw-covid-19-data/covid-19-tests-by-date-and-postcode-local-health-district-and-local-government-area-aggregated.csv'},
      transform: [
        {
          filter: {
            and: [
              {field: 'lhd_2010_name', equal: 'South Western Sydney'},
              {not: {field: 'lga_name19', equal: 'Penrith (C)'}}
            ]
          }
        }
      ],
      mark: 'line',
      encoding: {
        x: {timeUnit: 'yearmonthdate', field: 'test_date', title: 'Date', type: 'temporal'},
        y: {
          aggregate: 'sum',
          field: 'test_count',
          type: 'quantitative',
          axis: {
            title: 'Daily Tests'
          }
        }
      }
    }
  ],
  resolve: {scale: {y: 'independent'}}
};

// Embed the visualization in the container with id `vis`
vegaEmbed('#daily_and_cumulative_cases', daily_and_cumulative_cases_spec);
vegaEmbed('#daily_cases_by_transmission_and_daily_tests', daily_cases_by_transmission_and_daily_tests_spec);
