import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import scss from "rollup-plugin-scss";

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/index.cjs.js", format: "cjs" },
    { file: "dist/index.esm.js", format: "esm" },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    scss({
      output: "dist/styles.css", // Generate a CSS file in the output directory
      sass: require("sass"), // Use Dart Sass
    }),
  ],
  external: ["react", "react-dom"],
};
