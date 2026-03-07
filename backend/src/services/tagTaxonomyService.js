/**
 * Resolves tag keys and builds AI prompt list from MongoDB TagCategory (or static fallback).
 * Used by: geminiService (prompt), bankController (getOrCreateTagIdsByKey at runtime).
 */
const TagCategory = require('../models/TagCategory');
const { getTagKeysForPrompt: getStaticTagKeysForPrompt, getTaxonomyByKey: getStaticTaxonomyByKey } = require('../data/tagTaxonomy');

/**
 * Returns a string of "tagKey: label" lines for the OpenAI prompt.
 * Loads from MongoDB TagCategory; if none found, uses static tagTaxonomy.
 * @returns {Promise<string>}
 */
async function getTagListForPrompt() {
  const categories = await TagCategory.find({ isActive: true })
    .sort({ sortOrder: 1, label: 1 })
    .lean();

  if (!categories || categories.length === 0) {
    return getStaticTagKeysForPrompt();
  }

  const lines = [];
  for (const cat of categories) {
    const subItems = cat.subItems || [];
    for (const sub of subItems) {
      if (sub.tagKey && sub.label) {
        lines.push(`${sub.tagKey}: ${sub.label}`);
      }
    }
  }

  if (lines.length === 0) {
    return getStaticTagKeysForPrompt();
  }

  return lines.join(', ');
}

/**
 * Resolves a tagKey to { tagKey, label, group } for Tag creation.
 * Looks up in MongoDB TagCategory first; falls back to static tagTaxonomy.
 * @param {string} tagKey
 * @returns {Promise<{ tagKey: string, label: string, group: string } | null>}
 */
async function getTaxonomyByKey(tagKey) {
  const key = typeof tagKey === 'string' ? tagKey.trim() : '';
  if (!key) return null;

  const category = await TagCategory.findOne(
    { isActive: true, 'subItems.tagKey': key },
    { slug: 1, subItems: 1 }
  ).lean();

  if (category) {
    const sub = (category.subItems || []).find((s) => s.tagKey === key);
    if (sub) {
      return {
        tagKey: key,
        label: sub.label || key,
        group: category.slug || 'misc',
      };
    }
  }

  return getStaticTaxonomyByKey(key) || null;
}

module.exports = {
  getTagListForPrompt,
  getTaxonomyByKey,
};
