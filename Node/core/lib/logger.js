"use strict";
var sprintf = require('sprintf-js');
var Channel = require('./Channel');
var consts = require('./consts');
var prompts = require('./dialogs/Prompts');
var debugLoggingEnabled = new RegExp('\\bbotbuilder\\b', 'i').test(process.env.NODE_DEBUG || '');
function error(fmt) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var msg = args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt;
    console.error('ERROR: ' + msg);
}
exports.error = error;
function warn(addressable, fmt) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var prefix = getPrefix(addressable);
    var msg = args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt;
    console.warn(prefix + 'WARN: ' + msg);
}
exports.warn = warn;
function info(addressable, fmt) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var channelId = Channel.getChannelId(addressable);
    if (channelId === Channel.channels.emulator || debugLoggingEnabled) {
        var prefix = getPrefix(addressable);
        var msg = args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt;
        console.info(prefix + msg);
    }
}
exports.info = info;
function getPrefix(addressable) {
    var prefix = '';
    if (addressable && addressable.sessionState && addressable.sessionState.callstack) {
        var callstack = addressable.sessionState.callstack;
        for (var i = 0; i < callstack.length; i++) {
            if (i == callstack.length - 1) {
                var cur = callstack[i];
                switch (cur.id) {
                    case consts.DialogId.Prompts:
                        var promptType = prompts.PromptType[cur.state.promptType];
                        prefix += 'Prompts.' + promptType + ' - ';
                        break;
                    case consts.DialogId.FirstRun:
                        prefix += 'Middleware.firstRun - ';
                        break;
                    default:
                        if (cur.id.indexOf('*:') == 0) {
                            prefix += cur.id.substr(2) + ' - ';
                        }
                        else {
                            prefix += cur.id + ' - ';
                        }
                        break;
                }
            }
            else {
                prefix += '.';
            }
        }
    }
    return prefix;
}
