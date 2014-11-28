jQuery Typeahead Tagging
========================

A jQuery plugin to turn a regular input into a tag input with typeahead
autocompletion.

Check the example at `the project page
<https://bitmazk.github.io/jquery-typeahead-tagging/>`_.

Usage
-----

You need a regular text input.

.. code-block:: html

    <input type="text" id="taginput" value="">

And then you initialize the script.

.. code-block:: javascript

    // The source of the tags for autocompletion
    var tagsource = ['Foo', 'Bar', 'Anoter Tag', 'Even more tags',
                     'Such autocomplete', 'Many tags', 'Wow'];

    // Turn the input into the tagging input
    $('#taginput').tagging(tagsource);

There you go. All done.


If you want to limit the maximum amount of tags, that can be added, specify the maximum
amount as data attribute.

.. code-block:: html

    <!-- this input will only take 3 tags -->
    <input type="text" data-max-tags="3" id="taginput" value="">


The value of the input will be all tags separated by comma. E.g. ``Foo,Bar``.


Plugin API
----------

All the following assumes, that the plugin was initialized with something like
``$('#foobar').tagging(['list', 'of', 'tags'])``.


Getting the plugin intance
++++++++++++++++++++++++++

Returns the plugin instance, that is stored on the element.

.. code-block:: javascript

    var plugin = $('#foobar').tagging();
    >> TypeaheadTaggingPlugin {element: input#foobar, input: input.tagging_li_new_input.tt-input, ul: ul.tagging_ul…}


Clearing the input
++++++++++++++++++

Sets the value of the input to be blank and removes all tags.

.. code-block:: javascript

    var plugin = $('#foobar').tagging('clear');


Getting and setting a value
+++++++++++++++++++++++++++

Either returns a value or if provided with an array of strings, sets the value on the input and creates the tags.

.. code-block:: javascript

    $('#foobar').tagging('value', ['this', 'is', 'the', 'new', 'value'];
    $('#foobar').tagging('value').
    >> ['this', 'is', 'the', 'new', 'value']
