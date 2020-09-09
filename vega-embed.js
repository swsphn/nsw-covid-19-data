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

var daily_and_cumulative_cases_spec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  //autosize: 'fit',
  width: 'container',
  height: 'container',
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
  layer: [
    {
      selection: {date: {type: 'interval', bind: 'scales', encodings: ['x']}},
      mark: {type: 'bar', tooltip: true},
      encoding: {
        x: {timeUnit: 'yearmonthdate', field: 'notification_date', type: 'temporal', title: "Date"},
        color: {field: 'lga_name19', type: 'nominal', title: "LGA", legend: {orient: "top", columns: 4}},
        y: {
          aggregate: 'count',
          field: 'lga_name19',
          type: 'quantitative',
          title: "Cases",
          axis: {
            title: 'Daily Cases by SWS LGA'
          }
        }
      }
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
  title: 'South Western Sydney Daily Tests and Cases by Infection Source',
  layer: [
    {
      selection: {date: {type: 'interval', bind: 'scales', encodings: ['x']}},
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
      mark: {type: 'bar', tooltip: true},
      encoding: {
        x: {timeUnit: 'yearmonthdate', field: 'notification_date', type: 'temporal', title: 'Date'},
        color: {
          field: 'likely_source_of_infection',
          type: 'nominal',
          title: 'Infection Source',
          legend: {orient: "top"}
        },
        y: {
          aggregate: 'count',
          field: 'likely_source_of_infection',
          type: 'quantitative',
          title: 'Cases',
          axis: {
            title: 'Daily Cases by Infection Source'
          }
        }
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


var cumulative_cases_by_SWS_LGA_spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  width: "container",
  height: "container",
  config: sws_phn_config,
  title: "Cumulative COVID-19 Cases by LGA in South Western Sydney",
  selection: {date: {type: 'interval', bind: 'scales', encodings: ['x']}},
  resolve: {scale: {y: 'independent'}},
  data: {
    url: "https://davidwales.github.io/nsw-covid-19-data/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv"
  },
  transform: [
    {
      filter: {
        and: [
          {field: "lhd_2010_name", equal: "South Western Sydney"},
          {not: {field: "lga_name19", equal: "Penrith"}}
        ]
      }
    },
    {
      aggregate: [{op: "count", as: "date_lga_count"}],
      groupby: ["notification_date", "lga_name19"]
    },
    {
      window: [
        {op: "sum", field: "date_lga_count", as: "cum_date_lga_count"}
      ],
      groupby: ["lga_name19"],
      frame: [null, 0]
    }
  ],
  mark: {type: "line", point: "transparent", tooltip: true},
  encoding: {
    x: {
      timeUnit: "yearmonthdate",
      field: "notification_date",
      title: "Date",
      type: "temporal"
    },
    y: {field: "cum_date_lga_count", title: "Cumulative Cases", type: "quantitative"},
    color: {
      field: "lga_name19",
      type: "nominal",
      title: "LGA",
      legend: {orient: "top", columns: 4}
    }
  }
}

var cumulative_cases_by_postcode_template = {
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  width: "container",
  height: "container",
  config: sws_phn_config,
  title: null,
  selection: {date: {type: 'interval', bind: 'scales', encodings: ['x']}},
  resolve: {scale: {y: 'independent'}},
  data: {
    url: "https://davidwales.github.io/nsw-covid-19-data/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv"
  },
  transform: [
    {
      filter: {
        and: [
          {field: "lhd_2010_name", equal: "South Western Sydney"},
          {field: "lga_name19", equal: null}
        ]
      }
    },
    {
      aggregate: [{op: "count", as: "date_postcode_count"}],
      groupby: ["notification_date", "postcode"]
    },
    {
      window: [
        {op: "sum", field: "date_postcode_count", as: "cum_date_postcode_count"}
      ],
      groupby: ["postcode"],
      frame: [null, 0]
    }
  ],
  mark: {type: "line", interpolate: "monotone", point: true, tooltip: true},
  encoding: {
    x: {
      timeUnit: "yearmonthdate",
      field: "notification_date",
      title: "Date",
      type: "temporal"
    },
    y: {field: "cum_date_postcode_count", title: "Cumulative Cases", type: "quantitative"},
    color: {
      field: "postcode",
      type: "nominal",
      title: "Postcode",
      legend: {orient: "top", columns: 6}
    }
  }
}

let LGAs = ["Camden", "Campbelltown", "Canterbury-Bankstown", "Fairfield", "Liverpool", "Wingecarribee", "Wollondilly"]

LGAs.forEach(function (LGA) {
    // Apparently the only way to easily deep copy an object in plan JS is to round trip through JSON strings!!!
    // This is not the best solution in general, but should work for Vega Lite specs, as they are JSON specs.
    let vega_lite_spec = JSON.parse(JSON.stringify(cumulative_cases_by_postcode_template))
    vega_lite_spec.title = "Cumulative COVID-19 Cases by postcode in " + LGA
    vega_lite_spec.transform[0].filter.and[1].equal = LGA
    vegaEmbed('#cumulative_cases_by_postcode_' + LGA + '_LGA', vega_lite_spec);
  }
)

// Embed the visualization in the container with id `vis`
vegaEmbed('#daily_and_cumulative_cases', daily_and_cumulative_cases_spec);
vegaEmbed('#daily_cases_by_transmission_and_daily_tests', daily_cases_by_transmission_and_daily_tests_spec);
vegaEmbed('#cumulative_cases_by_SWS_LGA', cumulative_cases_by_SWS_LGA_spec);
