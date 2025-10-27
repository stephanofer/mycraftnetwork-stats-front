;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a330a304-e6f6-4af4-8d64-4f9113986260",e._sentryDebugIdIdentifier="sentry-dbid-a330a304-e6f6-4af4-8d64-4f9113986260")}catch(e){}}();import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderComponent, r as renderTemplate } from './astro/server_D4xJ1nRx.mjs';
import { c as createInvalidVariablesError, g as getEnv$1, s as setOnSetGetEnv } from './runtime_cirzW02G.mjs';
import * as Sentry from '@sentry/astro';
import { c as createSvgComponent } from './runtime_Bd43pfw_.mjs';
import './index_DlITuZTi.mjs';
import { $ as $$Image } from './_astro_assets_Ogb9U0OI.mjs';
/* empty css                          */

const typeLabels = {
  kills: "Kills",
  kd: "K/D",
  maxstreak: "Mayor Racha",
  elo: "ELO",
  level: "Nivel",
  koth: "KOTHs"
};

const schema = {"API_RPG":{"context":"server","access":"secret","type":"string"},"API_SURVI":{"context":"server","access":"secret","type":"string"},"API_PLAYERS_RPG":{"context":"server","access":"secret","type":"string"},"API_PLAYERS_SURVI":{"context":"server","access":"secret","type":"string"},"SECRET_SENTRY_DSN":{"context":"client","access":"public","type":"string"}};

function getEnvFieldType(options) {
  const optional = options.optional ? options.default !== void 0 ? false : true : false;
  let type;
  if (options.type === "enum") {
    type = options.values.map((v) => `'${v}'`).join(" | ");
  } else {
    type = options.type;
  }
  return `${type}${optional ? " | undefined" : ""}`;
}
const stringValidator = ({ max, min, length, url, includes, startsWith, endsWith }) => (input) => {
  if (typeof input !== "string") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (max !== void 0 && !(input.length <= max)) {
    errors.push("max");
  }
  if (min !== void 0 && !(input.length >= min)) {
    errors.push("min");
  }
  if (length !== void 0 && !(input.length === length)) {
    errors.push("length");
  }
  if (url !== void 0 && !URL.canParse(input)) {
    errors.push("url");
  }
  if (includes !== void 0 && !input.includes(includes)) {
    errors.push("includes");
  }
  if (startsWith !== void 0 && !input.startsWith(startsWith)) {
    errors.push("startsWith");
  }
  if (endsWith !== void 0 && !input.endsWith(endsWith)) {
    errors.push("endsWith");
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: input
  };
};
const numberValidator = ({ gt, min, lt, max, int }) => (input) => {
  const num = parseFloat(input ?? "");
  if (isNaN(num)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (gt !== void 0 && !(num > gt)) {
    errors.push("gt");
  }
  if (min !== void 0 && !(num >= min)) {
    errors.push("min");
  }
  if (lt !== void 0 && !(num < lt)) {
    errors.push("lt");
  }
  if (max !== void 0 && !(num <= max)) {
    errors.push("max");
  }
  if (int !== void 0) {
    const isInt = Number.isInteger(num);
    if (!(int ? isInt : !isInt)) {
      errors.push("int");
    }
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: num
  };
};
const booleanValidator = (input) => {
  const bool = input === "true" ? true : input === "false" ? false : void 0;
  if (typeof bool !== "boolean") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: bool
  };
};
const enumValidator = ({ values }) => (input) => {
  if (!(typeof input === "string" ? values.includes(input) : false)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: input
  };
};
function selectValidator(options) {
  switch (options.type) {
    case "string":
      return stringValidator(options);
    case "number":
      return numberValidator(options);
    case "boolean":
      return booleanValidator;
    case "enum":
      return enumValidator(options);
  }
}
function validateEnvVariable(value, options) {
  const isOptional = options.optional || options.default !== void 0;
  if (isOptional && value === void 0) {
    return {
      ok: true,
      value: options.default
    };
  }
  if (!isOptional && value === void 0) {
    return {
      ok: false,
      errors: ["missing"]
    };
  }
  return selectValidator(options)(value);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-check

// @ts-expect-error
/** @returns {string} */
// used while generating the virtual module
// biome-ignore lint/correctness/noUnusedFunctionParameters: `key` is used by the generated code
// biome-ignore lint/correctness/noUnusedVariables: `key` is used by the generated code
const getEnv = (key) => {
	return getEnv$1(key);
};

const _internalGetSecret = (key) => {
	const rawVariable = getEnv(key);
	const variable = rawVariable === '' ? undefined : rawVariable;
	const options = schema[key];

	const result = validateEnvVariable(variable, options);
	if (result.ok) {
		return result.value;
	}
	const type = getEnvFieldType(options);
	throw createInvalidVariablesError(key, type, result);
};

setOnSetGetEnv(() => {
	API_RPG = _internalGetSecret("API_RPG");
API_SURVI = _internalGetSecret("API_SURVI");
_internalGetSecret("API_PLAYERS_RPG");
_internalGetSecret("API_PLAYERS_SURVI");

});
let API_RPG = _internalGetSecret("API_RPG");
let API_SURVI = _internalGetSecret("API_SURVI");
_internalGetSecret("API_PLAYERS_RPG");
_internalGetSecret("API_PLAYERS_SURVI");

async function getLeaderboard({
  mode,
  type,
  limit = 150,
  offset = 0
}) {
  try {
    const baseUrl = mode === "rpg" ? API_RPG : API_SURVI;
    const url = new URL(baseUrl);
    url.searchParams.append("type", type);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    Sentry.captureException(error);
    return {
      success: false,
      data: [],
      count: 0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}

const Trophy = createSvgComponent({"meta":{"src":"/_astro/Trophy.C6IH0R9a.svg","width":24,"height":24,"format":"svg"},"attributes":{"width":"24","height":"24","viewBox":"0 0 24 24"},"children":"<path fill=\"currentColor\" d=\"M5 20v-2h14v2zm0-3.5L3.725 8.475q-.05 0-.113.013T3.5 8.5q-.625 0-1.062-.438T2 7t.438-1.062T3.5 5.5t1.063.438T5 7q0 .175-.038.325t-.087.275L8 9l3.125-4.275q-.275-.2-.45-.525t-.175-.7q0-.625.438-1.063T12 2t1.063.438T13.5 3.5q0 .375-.175.7t-.45.525L16 9l3.125-1.4q-.05-.125-.088-.275T19 7q0-.625.438-1.063T20.5 5.5t1.063.438T22 7t-.437 1.063T20.5 8.5q-.05 0-.112-.012t-.113-.013L19 16.5zm1.7-2h10.6l.65-4.175l-2.625 1.15L12 6.9l-3.325 4.575l-2.625-1.15zm5.3 0\"></path>"});

const Add = createSvgComponent({"meta":{"src":"/_astro/Add.B44nvKgw.svg","width":24,"height":24,"format":"svg"},"attributes":{"width":"24","height":"24","viewBox":"0 0 24 24"},"children":"<path fill=\"currentColor\" d=\"M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z\" />"});

const Sword = createSvgComponent({"meta":{"src":"/_astro/Sword.mwCeU9ae.svg","width":24,"height":24,"format":"svg"},"attributes":{"width":"24","height":"24","viewBox":"0 0 24 24"},"children":"<path fill=\"currentColor\" d=\"M17.456 3L21 3.003l.002 3.523l-5.467 5.466l2.828 2.829l1.415-1.414l1.415 1.414l-2.475 2.475l2.828 2.829l-1.414 1.414l-2.829-2.829l-2.474 2.475l-1.415-1.414l1.414-1.415l-2.829-2.828l-2.828 2.828l1.415 1.415l-1.414 1.414l-2.475-2.475l-2.829 2.829l-1.414-1.414l2.829-2.83l-2.475-2.474l1.414-1.414l1.414 1.413l2.827-2.828l-5.46-5.46L2.999 3l3.546.003l5.453 5.454zm-7.58 10.406l-2.828 2.828l.708.707l2.827-2.828zM19 5.001h-.717l-4.87 4.869l.706.707L19 5.698zm-14 0v.7l11.241 11.241l.707-.707L5.715 5.002z\" />"});

const KD = createSvgComponent({"meta":{"src":"/_astro/KD.BBQ5DvkV.svg","width":32,"height":32,"format":"svg"},"attributes":{"width":"32","height":"32","viewBox":"0 0 32 32"},"children":"<path fill=\"currentColor\" d=\"M16 4c-2.918 0-5.652.762-7.688 2.344S5 10.375 5 13.437c0 2.805 1.379 4.989 2.125 5.97A5.4 5.4 0 0 0 7 20.468c0 1.191.715 2.191 1.656 2.75c.66.39 1.516.46 2.344.562v2.625l.313.313s.433.418 1.187.718c.754.301 1.898.563 3.5.563s2.746-.262 3.5-.563s1.188-.718 1.188-.718l.312-.313V23.78c.828-.101 1.684-.172 2.344-.562c.941-.559 1.656-1.559 1.656-2.75a5.4 5.4 0 0 0-.125-1.063c.746-.98 2.125-3.164 2.125-5.968c0-3.067-1.277-5.512-3.313-7.094C21.652 4.762 18.919 4 16 4m0 2c2.574 0 4.848.672 6.438 1.906C24.027 9.141 25 10.91 25 13.438c0 1.359-.438 2.562-.906 3.468A4.2 4.2 0 0 1 24 16h-2c0 1.238.34 2.059.594 2.656c.254.598.406.965.406 1.813c0 .48-.184.734-.688 1.031c-.503.297-1.335.5-2.312.5h-1v3.438c-.082.046-.027.035-.25.125c-.5.199-1.371.437-2.75.437s-2.25-.238-2.75-.438c-.223-.09-.168-.078-.25-.125V22h-1c-.977 0-1.809-.203-2.313-.5c-.503-.297-.687-.55-.687-1.031c0-.848.152-1.215.406-1.813C9.66 18.06 10 17.238 10 16H8c0 .387-.043.66-.094.906C7.438 16 7 14.796 7 13.438c0-2.528.973-4.297 2.563-5.532C11.152 6.672 13.425 6 16 6m-3 10a1.999 1.999 0 1 0 0 4a1.999 1.999 0 1 0 0-4m6 0a1.999 1.999 0 1 0 0 4a1.999 1.999 0 1 0 0-4m-3 3.75s-1.25 1.594-1.25 2.344c0 .375.25.562.5.562c.418 0 .75-.75.75-.75s.332.75.75.75c.25 0 .5-.187.5-.562c0-.75-1.25-2.344-1.25-2.344\" />"});

const Elo = createSvgComponent({"meta":{"src":"/_astro/Elo.Dfk9T8_w.svg","width":24,"height":24,"format":"svg"},"attributes":{"width":"24","height":"24","viewBox":"0 0 24 24"},"children":"<path fill=\"currentColor\" d=\"M21 11c0 5.55-3.84 10.74-9 12c-5.16-1.26-9-6.45-9-12V5l9-4l9 4zm-9 10c3.75-1 7-5.46 7-9.78V6.3l-7-3.12L5 6.3v4.92C5 15.54 8.25 20 12 21\" />"});

const Koth = createSvgComponent({"meta":{"src":"/_astro/Koth.CkU3kzTr.svg","width":24,"height":24,"format":"svg"},"attributes":{"width":"24","height":"24","viewBox":"0 0 24 24"},"children":"<path fill=\"currentColor\" d=\"M14.4 6H20v10h-7l-.4-2H7v7H5V4h9zm-.4 8h2v-2h2v-2h-2V8h-2v2l-1-2V6h-2v2H9V6H7v2h2v2H7v2h2v-2h2v2h2v-2l1 2zm-3-4V8h2v2zm3 0h2v2h-2z\" />"});

const MaxStreak = createSvgComponent({"meta":{"src":"/_astro/MaxStreak.k6KSJT5w.svg","width":32,"height":32,"format":"svg"},"attributes":{"width":"32","height":"32","viewBox":"0 0 32 32"},"children":"<path fill=\"currentColor\" d=\"M24.832 16.969c-.272-.647-.581-1.38-.883-2.285c-.79-2.369 1.734-4.953 1.758-4.977l-1.414-1.414c-.14.14-3.423 3.478-2.242 7.023c.326.978.652 1.75.938 2.43A9.4 9.4 0 0 1 24 22a6.24 6.24 0 0 1-4.19 5.293a8.52 8.52 0 0 0-2.103-8l-1.044-1.044l-.582 1.357c-1.836 4.284-4.021 6.154-5.306 6.934A5.84 5.84 0 0 1 8 22a9.6 9.6 0 0 1 .929-3.629A11.3 11.3 0 0 0 10 14v-1.778c.874.36 2 1.303 2 3.778v2.604l1.743-1.935c3.112-3.454 2.463-7.567 1.206-10.308A4.486 4.486 0 0 1 18 11h2c0-5.537-4.579-7-7-7h-2l1.2 1.599c.137.185 2.862 3.927 1.353 7.688A4.94 4.94 0 0 0 9 10H8v4a9.6 9.6 0 0 1-.929 3.629A11.3 11.3 0 0 0 6 22c0 3.848 3.823 8 10 8s10-4.152 10-8a11.4 11.4 0 0 0-1.168-5.031M12.835 27.526a16.5 16.5 0 0 0 4.367-5.598a6.1 6.1 0 0 1 .257 5.971A11 11 0 0 1 16 28a10.3 10.3 0 0 1-3.165-.474\" />"});

const Level = createSvgComponent({"meta":{"src":"/_astro/Level.wkAzM1lo.svg","width":24,"height":24,"format":"svg"},"attributes":{"width":"24","height":"24","viewBox":"0 0 24 24"},"children":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m5 14l7-7l7 7\" />"});

const Subtract = createSvgComponent({"meta":{"src":"/_astro/Subtract.BrxNbaVx.svg","width":24,"height":24,"format":"svg"},"attributes":{"width":"24","height":"24","viewBox":"0 0 24 24"},"children":"<path fill=\"currentColor\" d=\"M19 11H5v2h14z\" />"});

const $$Astro = createAstro("https://estadisticas.mycraft.es/");
const $$LeaderBoards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LeaderBoards;
  const { mode, type } = Astro2.props;
  const { data } = await getLeaderboard({ mode, type });
  const trophyColors = {
    1: "#FFD700",
    2: "#C0C0C0",
    3: "#CD7F32"
  };
  const typeIconMap = {
    kills: {
      component: Sword,
      color: "#DC143C"
    },
    kd: {
      component: KD,
      color: "#DC143C"
    },
    elo: {
      component: Elo,
      color: "#FFD700"
    },
    koth: {
      component: Koth,
      color: "#DC143C"
    },
    maxstreak: {
      component: MaxStreak,
      color: "#FF851B"
    },
    level: {
      component: Level,
      color: "#2ECC40"
    }
  };
  const IconComponent = typeIconMap[type].component;
  const IconColor = typeIconMap[type].color;
  return renderTemplate`${maybeRenderHead()}<div class="leaderboard-container" data-astro-cid-jo6c4wib> <div class="title" data-astro-cid-jo6c4wib> <div class="title-text" data-astro-cid-jo6c4wib> <span data-astro-cid-jo6c4wib>#</span> <span class="title-player" data-astro-cid-jo6c4wib>Jugador</span> <span data-astro-cid-jo6c4wib>${typeLabels[type]}</span> <span data-astro-cid-jo6c4wib>Actu.</span> </div> </div> <div class="content" data-astro-cid-jo6c4wib> ${data && data.length > 0 ? data.map((player) => renderTemplate`<a${addAttribute(`data ${player.rank <= 3 ? `top-${player.rank}` : ""}`, "class")} data-astro-cid-jo6c4wib> <span class="rank" data-astro-cid-jo6c4wib> ${player.rank <= 3 ? renderTemplate`${renderComponent($$result, "Trophy", Trophy, { "width": 48, "height": 48, "color": trophyColors[player.rank], "data-astro-cid-jo6c4wib": true })}` : renderTemplate`<span class="numeric-rank" data-astro-cid-jo6c4wib>${player.rank}</span>`} </span> <span class="player" data-astro-cid-jo6c4wib> ${renderComponent($$result, "Image", $$Image, { "src": player.userProfile?.skinUUID ? `https://render.crafty.gg/3d/bust/${player.userProfile.skinUUID}` : `https://render.crafty.gg/3d/bust/null`, "alt": `Avatar de ${player.userProfile?.lastNickname || "DESCONOCIDO"}`, "width": 60, "height": 60, "class": "player-image", "decoding": "async", "data-astro-cid-jo6c4wib": true })} ${player.userProfile?.lastNickname} </span> <span class="value" data-astro-cid-jo6c4wib> <div class="value-content" data-astro-cid-jo6c4wib> ${IconComponent && renderTemplate`${renderComponent($$result, "IconComponent", IconComponent, { "width": 24, "height": 24, "color": IconColor, "data-astro-cid-jo6c4wib": true })}`} <span data-astro-cid-jo6c4wib>${player.value}</span> </div> </span> <span class="update" data-astro-cid-jo6c4wib> <div class="update-content" data-astro-cid-jo6c4wib> ${player.dailyDelta > 0 && renderTemplate`${renderComponent($$result, "Add", Add, { "color": "#4CAF50", "width": 24, "height": 24, "data-astro-cid-jo6c4wib": true })}`} ${player.dailyDelta < 0 && renderTemplate`${renderComponent($$result, "Subtract", Subtract, { "color": "#F44336", "width": 24, "height": 24, "data-astro-cid-jo6c4wib": true })}`} <span class="update-value" data-astro-cid-jo6c4wib> ${player.dailyDelta < 0 ? Math.abs(player.dailyDelta) : player.dailyDelta} </span> </div> </span> </a>`) : renderTemplate`<div class="no-data" data-astro-cid-jo6c4wib> <span data-astro-cid-jo6c4wib>No se encontraron resultados</span> <span class="report-message" data-astro-cid-jo6c4wib>
¿Crees que es un error? Repórtalo en nuestro Discord
</span> </div>`} </div> </div> `;
}, "/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/src/components/LeaderBoards.astro", void 0);

const $$file = "/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/src/components/LeaderBoards.astro";
const $$url = undefined;

export { $$LeaderBoards as $, $$file as a, $$url as b, typeLabels as t };
