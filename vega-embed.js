// Assign the specification to a local variable.

var sws_phn_config = {
  "group": {"fill": "#e5e5e5"},
  "arc": {"fill": "#2b2c39"},
  "area": {"fill": "#2b2c39"},
  "line": {"stroke": "#2b2c39"},
  "path": {"stroke": "#2b2c39"},
  "rect": {"fill": "#2b2c39"},
  "shape": {"stroke": "#2b2c39"},
  "symbol": {"fill": "#2b2c39"},
  "range": {
    "category": [
      "#2283a2",
      "#003e6a",
      "#a1ce5e",
      //"#2b2c39",
      "#FDBE13",
      //"#EF8762",
      "#F2727E",
      "#EA3F3F",
      //"#26213C",
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

var width = 'container';
var height = 'container';
var autosize = {
  type: 'fit-x',
  contains: 'padding'
};
var daily_and_cumulative_cases_spec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  //autosize: 'fit',
  //width: 'container',
  //height: 'container',
  config: sws_phn_config,
  title: 'South Western Sydney Cumulative and Daily COVID-19 Cases by LGA',
  data: {url: 'https://davidwales.github.io/nsw-covid-19-data/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'},
  transform: [
    {
      filter: {
        and: [
          {field: 'lhd_2010_name', equal: 'South Western Sydney'},
          {not: {field: 'lga_name19', equal: 'Penrith'}}
        ]
      }
    },
    {
      window: [{op: 'count', field: 'notification_date', as: 'cumulative_count'}],
      frame: [null,0]
    }
  ],
  vconcat: [
    {
      autosize: autosize,
      width: width,//'container',
      height: height,
      layer: [
        {
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'yearmonthdate',
              field: 'notification_date',
              type: 'temporal',
              scale: {domain: {selection: 'brush'}}
            },
            y: {
              aggregate: 'count',
              field: 'lga_name19',
              type: 'quantitative',
              axis: {
                title: 'Daily Cases by SWS LGA'
              }
            },
            color: {field: 'lga_name19', type: 'nominal', legend: {title: null, direction: 'horizontal', orient: 'top'}}
          }
        },
        {
          mark: 'line',
          encoding: {
            x: {
              timeUnit: 'yearmonthdate',
              field: 'notification_date',
              title: null,
              type: 'temporal',
              scale: {domain: {selection: 'brush'}}
            },
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
    },
    {
      autosize: autosize,
      width: width,//'container',
      height: 30,
      mark: 'area',
      selection: {
        brush: {type: 'interval', encodings: ['x']}
      },
      encoding: {
        x: {timeUnit: 'yearmonthdate', field: 'notification_date', title: 'Date', type: 'temporal'},
        y: {
          aggregate: 'count',
          field: 'lga_name19',
          type: 'quantitative',
          axis: {
            title: null
          }
        },
        //color: {field: 'lga_name19', type: 'nominal', legend: {title: 'LGA'}}
      },
    }
  ]
};

var daily_cases_by_transmission_and_daily_tests_spec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  //autosize: 'fit',
  //width: width,
  //height: width,
  config: sws_phn_config,
  title: 'South Western Sydney Daily Tests and Cases by Infection Source',
  vconcat: [
    {
      autosize: autosize,
      width: width,
      height: height,
      layer: [
        {
          data: {url: 'https://davidwales.github.io/nsw-covid-19-data/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'},
          transform: [
            {
              filter: {
                and: [
                  {field: 'lhd_2010_name', equal: 'South Western Sydney'},
                  {not: {field: 'lga_name19', equal: 'Penrith'}}
                ]
              }
            }
          ],
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'yearmonthdate',
              field: 'notification_date',
              type: 'temporal',
              scale: {domain: {selection: 'brush'}}
            },
            y: {
              aggregate: 'count',
              field: 'likely_source_of_infection',
              type: 'quantitative',
              axis: {
                title: 'Daily Cases by Infection Source'
              }
            },
            color: {field: 'likely_source_of_infection', type: 'nominal', legend: {title: 'Infection Source', direction: 'horizontal', orient: 'top'}}
          }
        },
        {
          data: {url: 'https://davidwales.github.io/nsw-covid-19-data/covid-19-tests-by-date-and-postcode-local-health-district-and-local-government-area-aggregated.csv'},
          transform: [
            {
              filter: {
                and: [
                  {field: 'lhd_2010_name', equal: 'South Western Sydney'},
                  {not: {field: 'lga_name19', equal: 'Penrith'}}
                ]
              }
            }
          ],
          mark: 'line',
          encoding: {
            x: {
              timeUnit: 'yearmonthdate',
              field: 'test_date',
              title: null,
              type: 'temporal',
              scale: {domain: {selection: 'brush'}}
            },
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
    },
    // minichart for x-axis domain selection
    {
      data: {url: 'https://davidwales.github.io/nsw-covid-19-data/covid-19-tests-by-date-and-postcode-local-health-district-and-local-government-area-aggregated.csv'},
      transform: [
        {
          filter: {
            and: [
              {field: 'lhd_2010_name', equal: 'South Western Sydney'},
              {not: {field: 'lga_name19', equal: 'Penrith'}}
            ]
          }
        }
      ],
      autosize: autosize,
      width: width,
      height: 30,
      mark: 'area',
      selection: {
        brush: {type: 'interval', encodings: ['x']}
      },
      encoding: {
        x: {
          timeUnit: 'yearmonthdate',
          field: 'test_date',
          title: 'Date',
          type: 'temporal',
        },
        y: {
          aggregate: 'sum',
          field: 'test_count',
          type: 'quantitative',
          axis: {
            title: null
          }
        }
      }
    },

  ]
};

// Embed the visualization in the container with id `vis`
vegaEmbed('#daily_and_cumulative_cases', daily_and_cumulative_cases_spec);
vegaEmbed('#daily_cases_by_transmission_and_daily_tests', daily_cases_by_transmission_and_daily_tests_spec);
