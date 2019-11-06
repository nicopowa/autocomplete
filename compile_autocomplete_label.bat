cls
pushd %~dp0
java -jar ../../_closure/compiler.jar ^
--js ../../_closure/goog/base.js ^
--create_source_map source_map ^
--compilation_level ADVANCED_OPTIMIZATIONS ^
--isolation_mode IIFE ^
--warning_level VERBOSE ^
--language_in ES_NEXT ^
--language_out ES5_STRICT ^
--rewrite_polyfills=false ^
--generate_exports ^
--export_local_property_definitions ^
--js js/autocomplete.js ^
--js js/autocomplete_label.js ^
--js_output_file js/autocomplete_label.min.js
popd