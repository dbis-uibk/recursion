module.exports = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = function(g, d, t) {	
            	var db = {};
            	db.group = g;
                db.desc = d;
                db.table = t;
                return db;
            },
        peg$c1 = function(g) {return g[4]},
        peg$c2 = function(d) {return d == null ? "" : d[0][4]},
        peg$c3 = function(t, d) {return {name:t,header:d.head,data:d.entry}},
        peg$c4 = function(h, e) {	var data = {};
            	data.head = h;
            	data.entry = e;
            	return data;
            },
        peg$c5 = function(h1, h2) {	var head = [];
            	
                head.push({name:h1[0],type:h1[4][1]})
                for(var i in h2){
                	head.push({name:h2[i][2],type:h2[i][6][1]});
                }
            	return head;
            },
        peg$c6 = function(e1, e2) {
            	var data = [];
                data.push(e1[0]);
                for(var i in e2){
                	data.push(e2[i][2]);
                }
                
                return data;
            },
        peg$c7 = /^[A-Za-z_\xC4\xE4\xD6\xF6\xDC\xFC]/,
        peg$c8 = { type: "class", value: "[A-Za-z_\xC4\xE4\xD6\xF6\xDC\xFC]", description: "[A-Za-z_\xC4\xE4\xD6\xF6\xDC\xFC]" },
        peg$c9 = function(str) { return str.join('') },
        peg$c10 = /^[A-Za-z\xC4\xE4\xD6\xF6\xDC\xFC ]/,
        peg$c11 = { type: "class", value: "[A-Za-z\xC4\xE4\xD6\xF6\xDC\xFC ]", description: "[A-Za-z\xC4\xE4\xD6\xF6\xDC\xFC ]" },
        peg$c12 = function(str) { return str.join("").trim() },
        peg$c13 = /^[A-Za-z_\xC4\xE4\xD6\xF6\xDC\xFC0-9]/,
        peg$c14 = { type: "class", value: "[A-Za-z_\xC4\xE4\xD6\xF6\xDC\xFC0-9]", description: "[A-Za-z_\xC4\xE4\xD6\xF6\xDC\xFC0-9]" },
        peg$c15 = function(str) {return str.join('')},
        peg$c16 = /^[0-9]/,
        peg$c17 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c18 = function(digits) { var x = flatstr(digits);
            if (x.indexOf('.') >= 0) {
              return parseFloat(x);
            }
            return parseInt(x);
          },
        peg$c19 = /^[ \t\n\r]/,
        peg$c20 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c21 = /^[\n]/,
        peg$c22 = { type: "class", value: "[\\n]", description: "[\\n]" },
        peg$c23 = ".",
        peg$c24 = { type: "literal", value: ".", description: "\".\"" },
        peg$c25 = ",",
        peg$c26 = { type: "literal", value: ",", description: "\",\"" },
        peg$c27 = ":",
        peg$c28 = { type: "literal", value: ":", description: "\":\"" },
        peg$c29 = "{",
        peg$c30 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c31 = "}",
        peg$c32 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c33 = "=",
        peg$c34 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c35 = "'",
        peg$c36 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c37 = "number",
        peg$c38 = { type: "literal", value: "NUMBER", description: "\"NUMBER\"" },
        peg$c39 = "string",
        peg$c40 = { type: "literal", value: "STRING", description: "\"STRING\"" },
        peg$c41 = "group",
        peg$c42 = { type: "literal", value: "GROUP", description: "\"GROUP\"" },
        peg$c43 = "description",
        peg$c44 = { type: "literal", value: "DESCRIPTION", description: "\"DESCRIPTION\"" },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsedatabase();

      return s0;
    }

    function peg$parsedatabase() {
      var s0;

      s0 = peg$parsemultiDatabase();
      if (s0 === peg$FAILED) {
        s0 = peg$parsesingleDatabase();
      }

      return s0;
    }

    function peg$parsemultiDatabase() {
      var s0, s1;

      s0 = [];
      s1 = peg$parsesingleDatabase();
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parsesingleDatabase();
      }

      return s0;
    }

    function peg$parsesingleDatabase() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseparseGroup();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseparseDesc();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseparseTables();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c0(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseparseGroup() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseGROUP();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhitespace();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsecolon();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhitespace();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsegroupName();
              if (s6 !== peg$FAILED) {
                s2 = [s2, s3, s4, s5, s6];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace1();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c1(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseparseDesc() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      s3 = peg$parseDESC();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsewhitespace();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsecolon();
          if (s5 !== peg$FAILED) {
            s6 = peg$parsewhitespace();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsegroupName();
              if (s7 !== peg$FAILED) {
                s3 = [s3, s4, s5, s6, s7];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhitespace1();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseparseTables() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseparseTable();
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseparseTable();
      }

      return s0;
    }

    function peg$parseparseTable() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      s1 = peg$parsename();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsewhitespace();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseequals();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsewhitespace();
            if (s4 !== peg$FAILED) {
              s5 = peg$parselcurly();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsewhitespace();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseparseData();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsewhitespace();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parsercurly();
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parsewhitespace();
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c3(s1, s7);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseparseData() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseparseDataHead();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseparseDataEntry();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c4(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseparseDataHead() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parsename();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhitespace();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsecolon();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhitespace();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseSTRING();
              if (s6 === peg$FAILED) {
                s6 = peg$parseNUMBER();
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsewhitespace();
                if (s7 !== peg$FAILED) {
                  s2 = [s2, s3, s4, s5, s6, s7];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsecomma();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsewhitespace();
          if (s5 !== peg$FAILED) {
            s6 = peg$parsename();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsewhitespace();
              if (s7 !== peg$FAILED) {
                s8 = peg$parsecolon();
                if (s8 !== peg$FAILED) {
                  s9 = peg$parsewhitespace();
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parseSTRING();
                    if (s10 === peg$FAILED) {
                      s10 = peg$parseNUMBER();
                    }
                    if (s10 !== peg$FAILED) {
                      s11 = peg$parsewhitespace();
                      if (s11 !== peg$FAILED) {
                        s4 = [s4, s5, s6, s7, s8, s9, s10, s11];
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsecomma();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhitespace();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsename();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsewhitespace();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsecolon();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsewhitespace();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parseSTRING();
                      if (s10 === peg$FAILED) {
                        s10 = peg$parseNUMBER();
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsewhitespace();
                        if (s11 !== peg$FAILED) {
                          s4 = [s4, s5, s6, s7, s8, s9, s10, s11];
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c5(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseparseDataEntry() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseparseDataEntryLine();
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseparseDataEntryLine();
      }

      return s0;
    }

    function peg$parseparseDataEntryLine() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parsedataNumber();
      if (s2 === peg$FAILED) {
        s2 = peg$parsedataString();
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhitespace();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsecomma();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsewhitespace();
          if (s5 !== peg$FAILED) {
            s6 = peg$parsedataNumber();
            if (s6 === peg$FAILED) {
              s6 = peg$parsedataString();
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parsewhitespace();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsecomma();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhitespace();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsedataNumber();
              if (s6 === peg$FAILED) {
                s6 = peg$parsedataString();
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsewhitespace();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsename() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c7.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c7.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c9(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsegroupName() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c10.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c11); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c10.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c12(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsedataString() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsequote();
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c13.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c14); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c13.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c14); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequote();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c15(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsedigit() {
      var s0;

      if (peg$c16.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }

      return s0;
    }

    function peg$parsedataNumber() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      s3 = peg$parsedigit();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsedigit();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$currPos;
        s4 = peg$parsedot();
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parsedigit();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parsedigit();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$parsedot();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsedigit();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsedigit();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c18(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsewhitespace() {
      var s0, s1;

      s0 = [];
      if (peg$c19.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c19.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c20); }
        }
      }

      return s0;
    }

    function peg$parsewhitespace1() {
      var s0, s1;

      s0 = [];
      if (peg$c19.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c19.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c20); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsenewline() {
      var s0, s1;

      s0 = [];
      if (peg$c21.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c22); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c21.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c22); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsedot() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 46) {
        s0 = peg$c23;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c24); }
      }

      return s0;
    }

    function peg$parsecomma() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 44) {
        s0 = peg$c25;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }

      return s0;
    }

    function peg$parsecolon() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 58) {
        s0 = peg$c27;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }

      return s0;
    }

    function peg$parselcurly() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 123) {
        s0 = peg$c29;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }

      return s0;
    }

    function peg$parsercurly() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 125) {
        s0 = peg$c31;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }

      return s0;
    }

    function peg$parseequals() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 61) {
        s0 = peg$c33;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }

      return s0;
    }

    function peg$parsequote() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 39) {
        s0 = peg$c35;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }

      return s0;
    }

    function peg$parseNUMBER() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c37) {
          s2 = input.substr(peg$currPos, 6);
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c38); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTRING() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c39) {
          s2 = input.substr(peg$currPos, 6);
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c40); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGROUP() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c41) {
          s2 = input.substr(peg$currPos, 5);
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c42); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDESC() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsewhitespace();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 11).toLowerCase() === peg$c43) {
          s2 = input.substr(peg$currPos, 11);
          peg$currPos += 11;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c44); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }


    function append(arr, x) {
        arr[arr.length] = x;
        return arr;
      }

    function flatten(x, rejectSpace, acc) {
        acc = acc || [];
        if (x == null || x == undefined) {
          if (!rejectSpace) {
            return append(acc, x);
          }
          return acc;
        }
        if (x.length == undefined) { // Just an object, not a string or array.
          return append(acc, x);
        }
        if (rejectSpace &&
          ((x.length == 0) ||
           (typeof(x) == "string" &&
            x.match(/^\s*$/)))) {
          return acc;
        }
        if (typeof(x) == "string") {
          return append(acc, x);
        }
        for (var i = 0; i < x.length; i++) {
          flatten(x[i], rejectSpace, acc);
        }
        return acc;
      }

    function flatstr(x, rejectSpace, joinChar) {
        return flatten(x, rejectSpace, []).join(joinChar || '');
     }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();