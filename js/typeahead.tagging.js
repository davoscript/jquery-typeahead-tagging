/*
 * jQuery Typeahead Tagging v0.2.1
 *
 * A jQuery plugin to allow managing tags with typeahead autocompletion.
 *
 * Latest source at https://github.com/bitmazk/jquery-typeahead-tagging
 *
 * Current issues/TODO:
 *  - prevent already added tags from showing up in the autocomplete results
 *  - prevent umlauts from being cleaned out
 *
 */

// Events =================================================================

// when clicking x inside taglike li remove tag

// focus the input for new tags when clicking the ul looking like an input

// key events for the new tag input

// IE < 9 compatibility taken from developer.mozilla.org
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var k;
        if (this === null) {
            throw new TypeError('"this" is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0; // jshint ignore:line
        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}


function TypeaheadTaggingPlugin(element) {

    this.element = element;                                             // the original input element
    this.input = undefined;                                             // the typeahead input

    this.CLEANING_PATTERN = /[^\w\s-]+/g;                               // The regex pattern to clean tags with.
    this.INPUT_WRAPPER = '<div class="tagging_wrapper"></div>';
    this.DATASETNAME = 'tagging';                                       // The name of the typeahead dataset.

    // TODO initialize properly
    //this.max_tags = parseInt(this.$element.attr('data-max-tags'));      // The maximum number of allowed tags
    this.max_tags = 3;

    // TODO shrink wrap ul once input wraps into next line

}

TypeaheadTaggingPlugin.prototype.add_tag = function (value) {

    // adds the tag to the value and creates a new tag element

    value = this.clean_value(value);

    if (!value) {
        return;
    }

    if (this.add_to_value(value)) {
        this.append_li(value);
    }

    $(this.input).typeahead('val', '');

};

TypeaheadTaggingPlugin.prototype.add_to_value = function (value) {

    // adds a tag to the original input's value

    var taglist, // the list of tags, that is currently set as comma separated list on the original input
        added;   // if the tag was added or not

    added = false;
    taglist = this.get_taglist();

    if (taglist.indexOf(value) === -1) {
        taglist.push(value);
        added = true;
    }

    this.set_taglist(taglist);

    return added;
};

TypeaheadTaggingPlugin.prototype.append_li = function (value) {

    // takes a string value and appends it as a new tag

    var li,             // the new li element
        tagging_li_new, // the li element holding the typeahead input
        span;           // the span, that is clicked to delete a tag

    // create the new list item
    span = document.createElement('span');
    span.classList.add('tagging_delete_tag');
    span.setAttribute('data-class', 'tagging_delete_tag');
    span.textContent = 'x';

    li = document.createElement('li');
    li.textContent = value;
    li.appendChild(span);
    li.classList.add('tagging_li');
    li.setAttribute('data-value', value);
    // append it to the list
    if (this.input !== undefined) {
        tagging_li_new = this.element.parentElement.querySelector('[data-class="tagging_li_new"]');
        tagging_li_new.parentNode.insertBefore(li, tagging_li_new);
    } else {
        this.element.parentElement.querySelector('[data-class="tagging_ul"]').appendChild(li);
    }

    // assign click event to span, that should remove the tag
    span.onclick = this.handle_click_delete();

};

TypeaheadTaggingPlugin.prototype.clean_value = function (value) {

    // cleans the value from problematic characters

    return value.replace(this.CLEANING_PATTERN, '');

};

TypeaheadTaggingPlugin.prototype.create_li_with_input = function () {

    // append another li with the input

    var li; // the new li element

    // create the new list item
    li = document.createElement('li');
    li.innerHTML = '<input type="text" class="tagging_li_new_input" data-class="tagging_li_new_input" />';
    li.classList.add('tagging_li_new');
    li.setAttribute('data-class', 'tagging_li_new');
    // append it to the list
    this.element.parentElement.querySelector('[data-class="tagging_ul"]').appendChild(li);
    // save the input instance on the plugin
    this.input = li.querySelector('[data-class="tagging_li_new_input"]');
    // assign event handlers to the input
    this.input.onkeyup = this.handle_input_keyup();
    this.input.onkeydown = this.handle_input_keydown();

};

TypeaheadTaggingPlugin.prototype.create_tags = function () {

    // create the initial tags from the value of the input

    var taglist; // the value of the input split at the comma sign to get a list of individual items

    taglist = this.get_taglist();

    for (var i = 0; i < taglist.length; i++) {
        this.append_li(taglist[i]);
    }

};

TypeaheadTaggingPlugin.prototype.create_ul = function () {

    // create the ul that holds the tags and insert it before the original input

    var ul; // the new inserted ul

    ul = document.createElement('ul');
    ul.classList.add('tagging_ul');
    ul.setAttribute('data-class', 'tagging_ul');
    this.element.parentNode.insertBefore(ul, this.element);

};

TypeaheadTaggingPlugin.prototype.delete_from_value = function (value) {

    // removes a tag from the original input's value
    var taglist, // the list of tag strings
        index;   // the index of the value inside the taglist

    taglist = this.get_taglist();
    index = taglist.indexOf(value);
    if (index !== -1) {
        taglist.splice(index, 1);
    }
    this.set_taglist(taglist);

};

TypeaheadTaggingPlugin.prototype.delete_tag = function (value) {

    // removes the tag and the value from the original input
    this.delete_from_value(value);
    this.element.parentElement.querySelector('[data-value="' + value + '"]').remove();

};

TypeaheadTaggingPlugin.prototype.get_taglist = function () {

    // returns the value of the original input as an array of tag values

    return this.element.value.split(',');

};

TypeaheadTaggingPlugin.prototype.handle_click_delete = function () {

    // handles clicking of the span, that removes a tag
    var handler;    // the handler, that executes the deletion of the tag
    var that = this;


    handler = function (e) {
        var value;  // the value of the tag, that should be deleted
        value = this.parentNode.getAttribute('data-value');
        that.delete_tag(value);
    };

    return handler;

};

TypeaheadTaggingPlugin.prototype.handle_input_keyup = function () {

    // handle keyup events
    var handler;    // the event handler function
    var that = this;  // for internal reference inside the handler ('this' becomes the element that causes the event)

    handler = function (e) {
        if (e.keyCode === 13 || e.keyCode === 188) {
            that.add_tag(this.value);
        }
    };

    return handler;
};

TypeaheadTaggingPlugin.prototype.handle_input_keydown = function () {

    // handle keydown events
    var handler,    // the event handler function
        taglist;    // the current list of tags
    var that = this;  // for internal reference inside the handler ('this' becomes the element that causes the event)

    handler = function (e) {
        if (e.keyCode === 9) {
            if (this.value && (!that.input.parentNode.querySelector('[class*=tt-hint]').value)) {
                e.preventDefault();
                that.add_tag(this.value);
            }
        }
        if (e.keyCode === 8) {
            if (!this.value) {
                // when backspace is pressed in an empty input, remove the last tag
                taglist = that.get_taglist();
                that.delete_tag(taglist[taglist.length - 1]);
            }
        }
    };

    return handler;
};

TypeaheadTaggingPlugin.prototype.init = function (tagsource) {

    // create or re-create the input

    // create a wrapper around the input
    $(this.element).wrap($(this.INPUT_WRAPPER));

    // hide the old input
    this.element.style.display = 'none';

    // create the ul that holds the tags
    this.create_ul();

    // create the initial tags from the value of the input
    this.create_tags();

    // append another li with the input
    this.create_li_with_input();

    // initialize typeahead
    this.init_typeahead(tagsource);

};

TypeaheadTaggingPlugin.prototype.init_typeahead = function (tagsource) {

    // initialize typeahead for the input
    if (tagsource) {


        $(this.input).typeahead(
            {
                hint     : true,
                highlight: true,
                minLength: 1
            },
            {
                name      : this.DATASETNAME,
                displayKey: 'value',
                source    : this.substringMatcher(tagsource)
            }
        );
    }
};

TypeaheadTaggingPlugin.prototype.set_taglist = function (taglist) {

    // saves an array of tag strings as value on the original input

    this.element.value = taglist.join();

};

TypeaheadTaggingPlugin.prototype.substringMatcher = function (tagsource) {

    var that = this;

    return function findMatches(q, cb) {
        var matches, substrRegex, values, taglist;

        // an array that will be populated with substring matches
        matches = [];

        // the values left for completion. Excludes the ones already being set as value on the input.
        values = [];

        // regex used to determine if a string contains the
        // substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string
        // that contains the substring `q`, add it to the `matches`
        // array
        taglist = that.get_taglist();
        for (var i = 0; i < tagsource.length; i++) {
            if (taglist.indexOf(tagsource[i]) === -1) {
                values.push(tagsource[i]);
            }
        }

        $.each(values, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push({value: str});
            }
        });

        cb(matches);
    };
};

(function ($) {
    $.fn.tagging = function (tagsource) {
        return this.each(function () {

            var plugin;     // the plugin instance

            plugin = new TypeaheadTaggingPlugin(this);
            $.data(this, 'init', plugin.init(tagsource));
            return plugin;

        });
    };

})(jQuery);
