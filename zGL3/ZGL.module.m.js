"use strict";

import {ZGL_Class} from './core/ZGL.class.m.js';
import {FuncScopeRedefiner} from './dependence/TinyTools/FuncScopeRedefiner.m.js';

var ZGL = ZGL_Class;

ZGL.Module.SYS_LIB = {
	FuncScopeRedefiner : FuncScopeRedefiner,
};

export {ZGL};